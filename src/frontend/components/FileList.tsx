import classNames from "classnames";
import React from "react";

import { useSelection } from "../context";

import Directory from "./Directory";
import File from "./File";
import { RootDirectoryId } from "./FileExplorer";

import type { FileListMap } from "../../types";



type FileListProps = {
    directoryId: string;
    files: FileListMap;
    parentKeys?: string;
    onSelectItem: (id: string, key: string, parentKeys: string) => void;
};

export default function FileList({ directoryId, files, parentKeys = '', onSelectItem }: FileListProps) {
    const { selectedItemId } = useSelection();

    return (files?.size > 0 &&
        <ul className={classNames('file-list', {'pl-2 border-l-1 border-gray-400': directoryId !== RootDirectoryId})} data-directory-id={directoryId}>
            {Array.from(files.entries()).map(([key, item]) => {
                const newParentKeys = `${parentKeys}${parentKeys ? ',' : ''}${key}`;
                return (<li key={item.id}>
                    {item.type === 'file' ? (
                        <File id={item.id} itemKey={key} name={item.name} parentKeys={parentKeys} isSelected={selectedItemId === item.id} onSelectItem={onSelectItem} />
                    ) : (
                        <Directory id={item.id} files={item.files} itemKey={key} name={item.name} parentKeys={newParentKeys} isSelected={selectedItemId === item.id} onSelectItem={onSelectItem} />
                    )}
            </li>)
        })}
        </ul>
    );
}
