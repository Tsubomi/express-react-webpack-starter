import { FolderIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import React, { memo, useState } from "react";

import { useSelection } from "../context";

import { RootDirectoryId } from "./FileExplorer";
import FileList from "./FileList";
import { FileListItemLabel } from "./FileListItemLabel";

import type { FileListMapDirectory } from "../../types";

type DirectoryItemProps = Omit<FileListMapDirectory, 'type'> & {
    isSelected?: boolean;
    itemKey?: string;
    parentKeys?: string;
    onSelectItem: (id: string, key: string, parentKeys: string) => void;
};

function DirectoryComponent({
  id,
  files,
  itemKey = '',
  name,
  parentKeys = '',
  isSelected,
  onSelectItem
}: DirectoryItemProps) {
    const { selectedItemId } = useSelection();
    const [directoryState, setDirectoryState] = useState({
        isExpanded: id === RootDirectoryId // Root directory is expanded by default
    });

    const toggleExpand = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onSelectItem
        setDirectoryState(prev => ({
            ...prev,
            isExpanded: !prev.isExpanded
        }));
    }, []);

    const handleSelectItem = React.useCallback(() => {
        onSelectItem(id, itemKey, parentKeys);
    }, [id, itemKey, parentKeys, onSelectItem]);

    return (
        <div className="directory">
            {id !== RootDirectoryId && (
                <FileListItemLabel
                  isSelected={isSelected || id === selectedItemId}
                  onClick={handleSelectItem}
                >
                    <FolderIcon size={16} />
                    <span className="line-clamp-1 max-w-full">{name}</span>
                    <span
                        className="ml-auto w-4 text-center"
                        onClick={toggleExpand}
                    >
                        {directoryState.isExpanded ? '▼' : '▶'}
                    </span>
                </FileListItemLabel>
            )}
            {directoryState.isExpanded && (
                <div className={classNames('directory-contents', {'pl-4': id !== RootDirectoryId})} data-parent-keys={parentKeys}>
                    <FileList
                      directoryId={id}
                      files={files}
                      parentKeys={parentKeys}
                      onSelectItem={onSelectItem}
                    />
                </div>
            )}
        </div>
    );
}

// Custom comparison function to optimize re-renders
const arePropsEqual = (prevProps: DirectoryItemProps, nextProps: DirectoryItemProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.name === nextProps.name &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.itemKey === nextProps.itemKey &&
        prevProps.parentKeys === nextProps.parentKeys &&
        // Map comparison - just check reference
        prevProps.files === nextProps.files
    );
};

// Export the memoized component
export default memo(DirectoryComponent, arePropsEqual);
