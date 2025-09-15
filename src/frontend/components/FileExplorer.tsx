import React, { useCallback } from "react";

import { FileExplorerProvider, useItems, useSelection, useFileExplorerUI } from "../context";

import NewItemDialog from "./Dialog/NewItemDialog";
import Directory from "./Directory";
import { ExplorerControls } from "./ExplorerControls";

export const RootDirectoryId = 'root';

function FileExplorerContent() {
    const { items } = useItems();
    const { selectedItemId, selectItem, currentDirectoryKeyPath, selectedItemKey, currentDirectory } = useSelection();
    const {
        isNewItemDialogOpen,
        openNewItemDialog,
        closeNewItemDialog,
        startDemo
    } = useFileExplorerUI();
    const { deleteItem, addItem } = useItems();

    // Use selectedItemId directly for button visibility instead of context's showDeleteItemButton
    const isDeleteButtonVisible = Boolean(selectedItemId);

    const isValidNewItemFormData = useCallback((formData: FormData) => {
        const targetItems = currentDirectory ? currentDirectory.files : items;
        const rawName = formData.get("name");
        const name = typeof rawName === "string" ? rawName.trim() : "";

        if (!name) {
            return {isValid: false, errorMessage: 'Name cannot be empty.'};
        }

        // Check if item with same name exists by searching through values
        const hasDuplicateName = Array.from(targetItems.values()).some(item =>
            item.name === name
        );

        if (hasDuplicateName) {
            return {isValid: false, errorMessage: 'An item with this name already exists in this directory.'};
        }

        return {isValid: true};
    }, [items, currentDirectory]);

    // Handler for adding new items from dialog
    const handleAddNewItem = useCallback((name: string, type: 'file' | 'directory') => {
        const parentPath = currentDirectoryKeyPath ? currentDirectoryKeyPath.split(',') : [];
        addItem(name, type, parentPath);
    }, [addItem, currentDirectoryKeyPath]);

    // Handler for deleting the selected item
    const handleDeleteItem = React.useCallback(() => {
        if (!selectedItemKey) return;

        const parentPath = currentDirectoryKeyPath ? currentDirectoryKeyPath.split(',') : [];
        deleteItem(selectedItemKey, parentPath);
    }, [deleteItem, selectedItemKey, currentDirectoryKeyPath]);

    return (
        <div className="h-full flex flex-col gap-2">
            <h1 className="text-2xl font-bold mb-2">File Explorer</h1>
            <ExplorerControls
                showDeleteItemButton={isDeleteButtonVisible}
                onOpenFileDialog={openNewItemDialog}
                onDeleteItem={handleDeleteItem}
                onStartDemo={startDemo}
            />
            <div className="rounded bg-gray-100 overflow-hidden h-full">
                <div className="overflow-auto h-full">
                    <Directory
                        id={RootDirectoryId}
                        name="Root Directory"
                        selectedItemId={selectedItemId}
                        onSelectItem={selectItem}
                        files={items}
                    />
                </div>
            </div>
            <NewItemDialog
                isOpen={isNewItemDialogOpen}
                isValidFormData={isValidNewItemFormData}
                onClose={closeNewItemDialog}
                onAddNewItem={handleAddNewItem}
            />
        </div>
    );
}

export function FileExplorer() {
    return (
        <FileExplorerProvider>
            <FileExplorerContent />
        </FileExplorerProvider>
    );
}
