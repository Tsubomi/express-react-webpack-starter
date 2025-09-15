type FileListMapItemBase = {
    id: string;
    name: string;
};

export type FileListMapDirectory = FileListMapItemBase & {
    type: 'directory';
    files: FileListMap; // Map of child items
};

export type FileListMapFile = FileListMapItemBase & {
    type: 'file';
};

export type FileListMap = Map<string, FileListMapItem>;

export type FileListMapItem = FileListMapFile | FileListMapDirectory;

export type FileExplorerState = {
    currentDirectory: FileListMapDirectory | null;
    currentDirectoryKeyPath: string; // New field to track the key path of the current directory
    showDeleteItemButton: boolean;
    isNewItemDialogOpen: boolean;
    items: FileListMap;
    selectedItemId: string | null;
    selectedItemKey: string | null;
};

export type IsValidNewItemFormDataReturn = {
    isValid: boolean;
    errorMessage?: string;
};
