import React, { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


import NewItemDialog from "./Dialog/NewItemDialog";
import Directory from "./Directory";
import { ExplorerControls } from "./ExplorerControls";

import type { FileExplorerState, FileListMap, FileListMapDirectory, FileListMapFile, FileListMapItem } from "../../types";

export const RootDirectoryId = 'root';

export function FileExplorer() {
    const [fileExplorerState, setFileExplorerState] = useState<FileExplorerState>({
        currentDirectory: null,
        // directory key path is a comma-separated string of keys leading to the current directory
        currentDirectoryKeyPath: '',
        showDeleteItemButton: false,
        isNewItemDialogOpen: false,
        items: null as unknown as FileListMap, // Will be initialized in useEffect
        selectedItemId: null,
        selectedItemKey: null
    });

    useEffect(() => {
        // Initialize with some sample data
        const initialItems: FileListMap = new Map();

        initialItems.set('file1.txt', {
            id: uuidv4(),
            name: 'file1.txt',
            type: 'file'
        } as FileListMapFile);

        const subDirectoryItems: FileListMap = new Map();
        subDirectoryItems.set('file2.txt', {
            id: uuidv4(),
            name: 'file2.txt',
            type: 'file'
        } as FileListMapFile);
        subDirectoryItems.set('file3.txt', {
            id: 'file3.txt',
            name: 'file3.txt',
            type: 'file'
        } as FileListMapFile);

        initialItems.set('subdir', {
            id: uuidv4(),
            name: 'subdir',
            type: 'directory',
            files: subDirectoryItems
        } as FileListMapDirectory);

        const subDirectoryItems2: FileListMap = new Map();
        subDirectoryItems2.set('file1.txt', {
            id: uuidv4(),
            name: 'file1.txt',
            type: 'file'
        } as FileListMapFile);

        const nestedSubDirItems: FileListMap = new Map();
        nestedSubDirItems.set('file5.txt', {
            id: uuidv4(),
            name: 'file5.txt',
            type: 'file'
        } as FileListMapFile);

        subDirectoryItems2.set('nestedsubdir', {
            id: uuidv4(),
            name: 'nestedsubdir',
            type: 'directory',
            files: nestedSubDirItems
        } as FileListMapDirectory);

        initialItems.set('subdir2', {
            id: uuidv4(),
            name: 'subdir2',
            type: 'directory',
            files: subDirectoryItems2
        } as FileListMapDirectory);

        setFileExplorerState(prevState => ({
            ...prevState,
            items: initialItems
        }));
    }, []);

    const handleOpenFileDialog = useCallback(() => {
        setFileExplorerState(prevState => ({
            ...prevState,
            isNewItemDialogOpen: true
        }));
    }, []);

    const handleCloseFileDialog = useCallback(() => {
        setFileExplorerState(prevState => ({
            ...prevState,
            isNewItemDialogOpen: false
        }));
    }, []);

    const isValidNewItemFormData = useCallback((formData: FormData) => {
        const items = fileExplorerState.currentDirectory ? (fileExplorerState.currentDirectory).files : fileExplorerState.items;
        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        if (!name) {
            return {isValid: false, errorMessage: 'Name cannot be empty.'};
        }

        // Check if item with same name exists in that directory
        if (items.has(name)) {
            return {isValid: false, errorMessage: 'An item with this name already exists in this directory.'};
        }

        return {isValid: true};
    }, [fileExplorerState]);

    const addNewItem = useCallback((name: string, type: 'file' | 'directory') => {
        let newFileListItem: FileListMapItem;
        const newItemId = uuidv4();

        if (type === 'file') {
            newFileListItem = {
                id: newItemId,
                name,
                type: 'file',
                size: 0 // Default size
            } as FileListMapFile;
        } else {
            newFileListItem = {
                id: newItemId,
                name,
                type: 'directory',
                files: new Map()
            } as FileListMapDirectory;
        }

        setFileExplorerState(prevState => {
            const parentKeys = prevState.currentDirectoryKeyPath;
            const parentKeyArray = parentKeys ? parentKeys.split(',') : [];
            let prevItems = prevState.items;
            const directoriesToUpdate: FileListMapDirectory[] = [];

            if (parentKeyArray.length > 0) {
                parentKeyArray.forEach(parentKey => {
                    const mapItem = prevItems.get(parentKey);
                    if (!mapItem || mapItem.type !== 'directory') {
                        return;
                    };
                    directoriesToUpdate.push(mapItem);
                    prevItems = mapItem.files;
                });
            }

            // start with the innermost directory and work outwards
            let newItems = new Map(prevItems);
            newItems.set(name, newFileListItem);

            for (let i = directoriesToUpdate.length - 1; i >= 0; i--) {
                const dir = directoriesToUpdate[i];
                newFileListItem = { ...dir, files: newItems };
                newItems = new Map(i === 0 ? prevState.items : directoriesToUpdate[i - 1].files);
                newItems.set(dir.name, newFileListItem);
            }

            return {
                ...prevState,
                items: newItems,
                isNewItemDialogOpen: false
            };
        });
    }, []);

    const deleteItem = useCallback(() => {

        if (!fileExplorerState.selectedItemKey) {
            return;
        }

        setFileExplorerState(prevState => {
            const parentKeys = prevState.currentDirectoryKeyPath;
            const parentKeyArray = parentKeys ? parentKeys.split(',') : [];
            let prevItems = prevState.items;
            const directoriesToUpdate: FileListMapDirectory[] = [];

            if (parentKeyArray.length > 0) {
                parentKeyArray.forEach(parentKey => {
                    const mapItem = prevItems.get(parentKey);
                    if (parentKey === prevState.selectedItemKey || !mapItem || mapItem.type !== 'directory') {
                        return;
                    };
                    directoriesToUpdate.push(mapItem);
                    prevItems = mapItem.files;
                });
            }

            // start with the innermost directory and work outwards
            let newItems = new Map(prevItems);
            newItems.delete(prevState.selectedItemKey as string);
            let newFileListItem: FileListMapItem;

            for (let i = directoriesToUpdate.length - 1; i >= 0; i--) {
                const dir = directoriesToUpdate[i];
                newFileListItem = { ...dir, files: newItems };
                newItems = new Map(i === 0 ? prevState.items : directoriesToUpdate[i - 1].files);
                newItems.set(dir.name, newFileListItem);
            }

            return {
                ...prevState,
                currentDirectory: null,
                currentDirectoryKeyPath: '',
                items: newItems,
                selectedItemId: null,
                selectedItemKey: null,
                showDeleteItemButton: false
            };
        });
    }, [fileExplorerState]);

    const onStartDemo = useCallback(() => {
        // const demoItems = getDemoItems();
        console.log('Demo started');

        // loop through demoItems and add them to the current items
    }, []);

    /**
     * Select an item if it is not selected, or deselect if it is already selected
     */
    const handleSelectItem = useCallback((id: string, key: string, parentKeys: string) => {
        console.log(`Selected item:\n- id: ${id}\n- key: ${key}\n- parentKeys: ${parentKeys}`);
        // Use functional updates when state depends on previous state
        setFileExplorerState(prevState => {
            const parentKeyArray = parentKeys ? parentKeys.split(',') : [];
            let currentDirectory = null;
            let currentDirectoryKeyPath = '';
            let selectedItemId = null;
            let selectedItemKey = null;
            let showDeleteItemButton = false;

            // item is not selected, so select it and set current directory if it's a directory
            if (prevState.selectedItemId !== id) {
                let items = prevState.items;

                if (parentKeyArray.length > 0) {
                    parentKeyArray.forEach(parentKey => {
                        const mapItem = items.get(parentKey);
                        if (key === parentKey || !mapItem || mapItem.type !== 'directory') {
                            return;
                        };
                        currentDirectory = mapItem;
                        items = currentDirectory.files;
                    });
                }

                currentDirectoryKeyPath = parentKeys;
                selectedItemId = id;
                selectedItemKey = key;
                showDeleteItemButton = true;
            }

            return {
                ...prevState,
                currentDirectory,
                currentDirectoryKeyPath,
                selectedItemId,
                selectedItemKey,
                showDeleteItemButton
            };
        });
    }, []);

    return (
        <div className="file-explorer grid grid-rows-[min-content_min-content_1fr] gap-2 h-full">
            <h1 className="text-lg font-semibold">File Explorer</h1>
            <ExplorerControls
                showDeleteItemButton={fileExplorerState.showDeleteItemButton}
                onOpenFileDialog={handleOpenFileDialog}
                onDeleteItem={deleteItem}
                onStartDemo={onStartDemo}
            />
            <div className="rounded bg-gray-100 overflow-hidden h-full">
                <Directory
                    id={RootDirectoryId} name="Root Directory" selectedItemId={fileExplorerState.selectedItemId} onSelectItem={handleSelectItem} files={fileExplorerState.items} />
            </div>
            <NewItemDialog isOpen={fileExplorerState.isNewItemDialogOpen} isValidFormData={isValidNewItemFormData} onClose={handleCloseFileDialog} onAddNewItem={addNewItem} />
        </div>
    );
}
