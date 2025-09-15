import { FileIcon } from "@phosphor-icons/react";
import React from "react";

import { FileListItemLabel } from "./FileListItemLabel";

import type { FileListMapFile } from "../../types";


type FileProps = Omit<FileListMapFile, 'type'> & {
  itemKey?: string;
  parentKeys?: string;
  isSelected?: boolean;
  onSelectItem: (id: string, key: string, parentKeys: string) => void;
};

export default function File({id, itemKey = '', name, parentKeys = '', isSelected, onSelectItem}: FileProps) {
  return (
    <FileListItemLabel isSelected={isSelected} onClick={() => onSelectItem(id, itemKey, parentKeys)}>
      <FileIcon size={16} />
      <span className="file-name" title={name}>{name}</span>
    </FileListItemLabel>
  );
}
