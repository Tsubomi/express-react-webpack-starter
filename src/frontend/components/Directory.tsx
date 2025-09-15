import { FolderIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import React from "react";

import { RootDirectoryId } from "./FileExplorer";
import FileList from "./FileList";
import { FileListItemLabel } from "./FileListItemLabel";

import type { FileListMapDirectory } from "../../types";

type DirectoryItemProps = Omit<FileListMapDirectory, 'type'> & {
    isSelected?: boolean;
    itemKey?: string;
    parentKeys?: string;
    selectedItemId?: string | null;
    onSelectItem: (id: string, key: string, parentKeys: string) => void;
};

export default function Directory({id, files, itemKey = '', name, parentKeys = '', isSelected, selectedItemId, onSelectItem}: DirectoryItemProps) {
    const [directoryState, setDirectoryState] = React.useState({
        isExpanded: id === RootDirectoryId // Root directory is expanded by default
    });

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onSelectItem
        setDirectoryState(prev => ({
            ...prev,
            isExpanded: !prev.isExpanded
        }));
    };

    return (
        <div className="directory">
            {id !== RootDirectoryId && (
                <FileListItemLabel isSelected={isSelected} onClick={() => onSelectItem(id, itemKey, parentKeys)}>
                    <FolderIcon size={16} />
                    <span>{name}</span>
                    <span
                        className="mr-2 w-4 text-center"
                        onClick={toggleExpand}
                    >
                        {directoryState.isExpanded ? '▼' : '▶'}
                    </span>
                </FileListItemLabel>
            )}
            {directoryState.isExpanded && (
                <div className={classNames('directory-contents', {'pl-4': id !== RootDirectoryId})} data-parent-keys={parentKeys}>
                    <FileList directoryId={id} files={files} parentKeys={parentKeys} selectedItemId={selectedItemId} onSelectItem={onSelectItem} />
                </div>
            )}
        </div>
    );
}
