import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import getDemoItems from '../demoStub';

import type { FileListMap, FileListMapDirectory, FileListMapFile, FileListMapItem } from "../types";
import type { ReactNode } from 'react';

// Items Context
type ItemsContextType = {
  items: FileListMap;
  setItems: React.Dispatch<React.SetStateAction<FileListMap>>;
  addItem: (name: string, type: 'file' | 'directory', parentPath: string[]) => void;
  deleteItem: (key: string, parentPath: string[]) => void;
};

const ItemsContext = createContext<ItemsContextType>({
  items: new Map(),
  setItems: () => {},
  addItem: () => {},
  deleteItem: () => {}
});

// Selection Context
type SelectionContextType = {
  selectedItemId: string | null;
  selectedItemKey: string | null;
  currentDirectory: FileListMapDirectory | null;
  currentDirectoryKeyPath: string;
  selectItem: (id: string, key: string, parentKeys: string) => void;
};

const SelectionContext = createContext<SelectionContextType>({
  selectedItemId: null,
  selectedItemKey: null,
  currentDirectory: null,
  currentDirectoryKeyPath: '',
  selectItem: () => {}
});

// UI Context
type UIContextType = {
  isNewItemDialogOpen: boolean;
  showDeleteItemButton: boolean;
  openNewItemDialog: () => void;
  closeNewItemDialog: () => void;
  startDemo: () => void;
};

const UIContext = createContext<UIContextType>({
  isNewItemDialogOpen: false,
  showDeleteItemButton: false,
  openNewItemDialog: () => {},
  closeNewItemDialog: () => {},
  startDemo: () => {}
});

// Hook exports
export const useItems = () => useContext(ItemsContext);
export const useSelection = () => useContext(SelectionContext);
export const useFileExplorerUI = () => useContext(UIContext);

// Provider component
export const FileExplorerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Items state
  const [items, setItems] = useState<FileListMap>(new Map());

  // Selection state
  const [selectionState, setSelectionState] = useState({
    selectedItemId: null as string | null,
    selectedItemKey: null as string | null,
    currentDirectory: null as FileListMapDirectory | null,
    currentDirectoryKeyPath: ''
  });

  // UI state
  const [uiState, setUIState] = useState({
    isNewItemDialogOpen: false,
    showDeleteItemButton: false
  });

  // Items actions
  const addItem = useCallback((name: string, type: 'file' | 'directory', parentPath: string[]) => {
    const newId = uuidv4(); // Generate a unique ID

    // Fix the TypeScript error by adding proper type assertions
    const newItem: FileListMapItem =
      type === 'directory'
        ? {
            id: newId,
            name: name,
            type: 'directory' as const,
            files: new Map()
          } as FileListMapDirectory
        : {
            id: newId,
            name: name,
            type: 'file' as const
          } as FileListMapFile;

    setItems(prevItems => {
      const updatedItems = new Map(prevItems);
      let currentMap = updatedItems;
      const path = [...parentPath];

      // Navigate to the correct directory
      if (path.length > 0) {
        for (let i = 0; i < path.length; i++) {
          const key = path[i];
          const item = currentMap.get(key);

          if (item && item.type === 'directory') {
            if (i === path.length - 1) {
              // We're at the target directory
              const updatedDir = {
                ...item,
                files: new Map(item.files).set(newId, newItem)
              } as FileListMapDirectory;
              currentMap.set(key, updatedDir);
            } else {
              // We need to go deeper
              const nextMap = new Map(item.files);
              const updatedDir = {
                ...item,
                files: nextMap
              } as FileListMapDirectory;
              currentMap.set(key, updatedDir);
              currentMap = nextMap;
            }
          }
        }
      } else {
        // Add to root
        updatedItems.set(newId, newItem);
      }

      return updatedItems;
    });

    // Close dialog after adding item
    setUIState(prev => ({ ...prev, isNewItemDialogOpen: false }));
  }, []);

  const deleteItem = useCallback((key: string, parentPath: string[]) => {
    setItems(prevItems => {
      // First, check if the item to delete is a directory or file
      let itemToDelete = null;

      // Check if our key matches the last path since that means we are deleting the directory itself
      if (parentPath.length > 0 && parentPath[parentPath.length - 1] === key) {
        parentPath = parentPath.slice(0, -1); // Remove last element to get parent path
      }

      // If we're at root level
      if (parentPath.length === 0) {
        itemToDelete = prevItems.get(key);

        // Simple deletion at root level
        const newItems = new Map(prevItems);
        newItems.delete(key);
        return newItems;
      }

      // For nested items, find the parent directory
      const newItems = new Map(prevItems);

      // Helper function to get an item at a specified path
      const getItemAtPath = (items: FileListMap, path: string[]): [FileListMapItem | null, FileListMap] => {
        let currentItems = items;
        let item: FileListMapItem | null = null;

        // Navigate to the last directory in the path
        for (let i = 0; i < path.length; i++) {
          const pathKey = path[i];
          item = currentItems.get(pathKey) || null;

          if (!item || i === path.length - 1) break;

          if (item.type === 'directory') {
            currentItems = item.files;
          } else {
            item = null;
            break;
          }
        }

        return [item, currentItems];
      };

      // Get the directory where our item should be
      const [parentDir] = getItemAtPath(
        newItems,
        parentPath.slice(0, parentPath.length) // Full path to containing directory
      );

      if (parentDir && parentDir.type === 'directory') {
        // Check if the key exists in this directory
        itemToDelete = parentDir.files.get(key);

        if (itemToDelete) {
          // Create new files Map without the item
          const updatedFiles = new Map(parentDir.files);
          updatedFiles.delete(key);

          // Update the directory
          const updatedDir = {
            ...parentDir,
            files: updatedFiles
          } as FileListMapDirectory;

          // Update the parent directory in our copy
          const parentKey = parentPath[parentPath.length - 1];

          if (parentPath.length === 1) {
            // Parent is at root level
            newItems.set(parentKey, updatedDir);
          } else {
            // Parent is nested, need to update all the way up
            const updateNestedDirectory = (
              items: FileListMap,
              path: string[],
              updatedChildDir: FileListMapDirectory,
              childKey: string
            ): FileListMap => {
              if (path.length === 0) return items;

              const newItems = new Map(items);
              const currentKey = path[0];
              const item = items.get(currentKey);

              if (!item || item.type !== 'directory') return items;

              if (path.length === 1) {
                // We're at the directory that needs updating
                const updatedDir = {
                  ...item,
                  files: new Map(item.files)
                } as FileListMapDirectory;

                updatedDir.files.set(childKey, updatedChildDir);
                newItems.set(currentKey, updatedDir);
              } else {
                // Go deeper
                const updatedFiles = updateNestedDirectory(
                  item.files,
                  path.slice(1),
                  updatedChildDir,
                  childKey
                );

                newItems.set(currentKey, {
                  ...item,
                  files: updatedFiles
                } as FileListMapDirectory);
              }

              return newItems;
            };

            // Update the entire path
            return updateNestedDirectory(
              newItems,
              parentPath.slice(0, -1),
              updatedDir,
              parentKey
            );
          }
        }
      }

      return newItems;
    });

    // Reset selection
    setSelectionState({
      selectedItemId: null,
      selectedItemKey: null,
      currentDirectory: null,
      currentDirectoryKeyPath: ''
    });
  }, []);

  // Selection actions
  const selectItem = useCallback((id: string, key: string, parentKeys: string) => {
    setSelectionState(prevState => {
      // If already selected, deselect
      if (prevState.selectedItemId === id) {
        return {
          selectedItemId: null,
          selectedItemKey: null,
          currentDirectory: null,
          currentDirectoryKeyPath: ''
        };
      }

      // Find current directory based on parent keys
      const findCurrentDirectory = (keyPath: string, itemsMap: FileListMap): FileListMapDirectory | null => {
        if (!keyPath) return null;

        const keyArray = keyPath.split(',');
        let currentItems = itemsMap;
        let currentDir: FileListMapDirectory | null = null;

        for (const key of keyArray) {
          const item = currentItems.get(key);
          if (!item || item.type !== 'directory') break;
          currentDir = item;
          currentItems = item.files;
        }

        return currentDir;
      };

      const currentDirectory = findCurrentDirectory(parentKeys, items);

      // Make sure we correctly identify the item being selected
      return {
        selectedItemId: id,
        selectedItemKey: key, // This is the key we need for deletion
        currentDirectory,
        currentDirectoryKeyPath: parentKeys
      };
    });

    setUIState(prev => ({ ...prev, showDeleteItemButton: true }));
  }, [items]);

  // UI actions
  const openNewItemDialog = useCallback(() => {
    setUIState(prev => ({ ...prev, isNewItemDialogOpen: true }));
  }, []);

  const closeNewItemDialog = useCallback(() => {
    setUIState(prev => ({ ...prev, isNewItemDialogOpen: false }));
  }, []);

  const startDemo = useCallback(() => {
    const demoItems = getDemoItems();
    setItems(demoItems);

    // Reset selection
    setSelectionState({
      selectedItemId: null,
      selectedItemKey: null,
      currentDirectory: null,
      currentDirectoryKeyPath: ''
    });

    setUIState(prev => ({ ...prev, showDeleteItemButton: false }));
  }, []);

  const itemsValue = useMemo(() => ({
    items, setItems, addItem, deleteItem
  }), [items, addItem, deleteItem]);

  return (
    <ItemsContext.Provider value={itemsValue}>
      <SelectionContext.Provider
        value={{
          ...selectionState,
          selectItem
        }}
      >
        <UIContext.Provider
          value={{
            ...uiState,
            openNewItemDialog,
            closeNewItemDialog,
            startDemo
          }}
        >
          {children}
        </UIContext.Provider>
      </SelectionContext.Provider>
    </ItemsContext.Provider>
  );
};
