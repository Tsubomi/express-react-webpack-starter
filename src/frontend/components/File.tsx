import {
  FileArchiveIcon,
  FileArrowDownIcon,
  FileAudioIcon,
  FileCloudIcon,
  FileCodeIcon,
  FileCssIcon,
  FileCsvIcon,
  FileDocIcon,
  FileHtmlIcon,
  FileImageIcon,
  FileJpgIcon,
  FileJsIcon,
  FileJsxIcon,
  FileMdIcon,
  FilePdfIcon,
  FilePngIcon,
  FilePptIcon,
  FileSqlIcon,
  FileSvgIcon,
  FileTextIcon,
  FileTsIcon,
  FileTsxIcon,
  FileTxtIcon,
  FileVideoIcon,
  FileVueIcon,
  FileXlsIcon,
  FileZipIcon,
  FileIcon
} from "@phosphor-icons/react";
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
  // get file extension
  const fileExtension = name.split('.').pop()?.toLowerCase();

  // Comprehensive icon mapping based on file extension
  // @todo - consider using a sprite instead for performance to minimize the
  // number of inline svgs rendered when displaying a large number of files
  const iconMap: Record<string, React.ReactNode> = {
    // Documents
    'txt': <FileTxtIcon size={16} />,
    'md': <FileMdIcon size={16} />,
    'pdf': <FilePdfIcon size={16} />,
    'doc': <FileDocIcon size={16} />,
    'docx': <FileDocIcon size={16} />,
    'rtf': <FileTextIcon size={16} />,
    'odt': <FileDocIcon size={16} />,
    'pages': <FileDocIcon size={16} />,

    // Spreadsheets
    'xls': <FileXlsIcon size={16} />,
    'xlsx': <FileXlsIcon size={16} />,
    'csv': <FileCsvIcon size={16} />,
    'ods': <FileXlsIcon size={16} />,
    'numbers': <FileXlsIcon size={16} />,

    // Presentations
    'ppt': <FilePptIcon size={16} />,
    'pptx': <FilePptIcon size={16} />,
    'key': <FilePptIcon size={16} />,
    'odp': <FilePptIcon size={16} />,

    // Web files
    'html': <FileHtmlIcon size={16} />,
    'htm': <FileHtmlIcon size={16} />,
    'css': <FileCssIcon size={16} />,
    'scss': <FileCssIcon size={16} />,
    'sass': <FileCssIcon size={16} />,
    'less': <FileCssIcon size={16} />,

    // Data files
    'json': <FileCodeIcon size={16} />,
    'xml': <FileCodeIcon size={16} />,
    'yaml': <FileCodeIcon size={16} />,
    'yml': <FileCodeIcon size={16} />,
    'toml': <FileCodeIcon size={16} />,
    'ini': <FileCodeIcon size={16} />,
    'env': <FileCodeIcon size={16} />,
    'sql': <FileSqlIcon size={16} />,

    // Programming languages
    'js': <FileJsIcon size={16} />,
    'jsx': <FileJsxIcon size={16} />,
    'ts': <FileTsIcon size={16} />,
    'tsx': <FileTsxIcon size={16} />,
    'vue': <FileVueIcon size={16} />,
    'php': <FileCodeIcon size={16} />,
    'py': <FileCodeIcon size={16} />,
    'rb': <FileCodeIcon size={16} />,
    'java': <FileCodeIcon size={16} />,
    'c': <FileCodeIcon size={16} />,
    'cpp': <FileCodeIcon size={16} />,
    'cs': <FileCodeIcon size={16} />,
    'go': <FileCodeIcon size={16} />,
    'rs': <FileCodeIcon size={16} />,
    'swift': <FileCodeIcon size={16} />,
    'kt': <FileCodeIcon size={16} />,
    'dart': <FileCodeIcon size={16} />,
    'sh': <FileCodeIcon size={16} />,
    'bat': <FileCodeIcon size={16} />,
    'ps1': <FileCodeIcon size={16} />,
    'r': <FileCodeIcon size={16} />,
    'lua': <FileCodeIcon size={16} />,
    'asm': <FileCodeIcon size={16} />,

    // Images
    'jpg': <FileJpgIcon size={16} />,
    'jpeg': <FileJpgIcon size={16} />,
    'png': <FilePngIcon size={16} />,
    'gif': <FileImageIcon size={16} />,
    'bmp': <FileImageIcon size={16} />,
    'tiff': <FileImageIcon size={16} />,
    'webp': <FileImageIcon size={16} />,
    'svg': <FileSvgIcon size={16} />,
    'ico': <FileImageIcon size={16} />,
    'psd': <FileImageIcon size={16} />,
    'ai': <FileImageIcon size={16} />,
    'sketch': <FileImageIcon size={16} />,
    'fig': <FileImageIcon size={16} />,

    // Audio
    'mp3': <FileAudioIcon size={16} />,
    'wav': <FileAudioIcon size={16} />,
    'ogg': <FileAudioIcon size={16} />,
    'flac': <FileAudioIcon size={16} />,
    'aac': <FileAudioIcon size={16} />,
    'm4a': <FileAudioIcon size={16} />,

    // Video
    'mp4': <FileVideoIcon size={16} />,
    'mov': <FileVideoIcon size={16} />,
    'wmv': <FileVideoIcon size={16} />,
    'avi': <FileVideoIcon size={16} />,
    'mkv': <FileVideoIcon size={16} />,
    'webm': <FileVideoIcon size={16} />,

    // Archives
    'zip': <FileZipIcon size={16} />,
    'rar': <FileArchiveIcon size={16} />,
    'tar': <FileArchiveIcon size={16} />,
    'gz': <FileArchiveIcon size={16} />,
    '7z': <FileArchiveIcon size={16} />,

    // Cloud & Deployment
    'docker': <FileCloudIcon size={16} />,
    'dockerfile': <FileCloudIcon size={16} />,
    'compose': <FileCloudIcon size={16} />,
    'tf': <FileCloudIcon size={16} />,
    'hcl': <FileCloudIcon size={16} />,

    // Other
    'log': <FileTextIcon size={16} />,
    'gitignore': <FileCodeIcon size={16} />,
    'lock': <FileArrowDownIcon size={16} />,
    'config': <FileCodeIcon size={16} />,
    'apk': <FileArrowDownIcon size={16} />,
    'ipa': <FileArrowDownIcon size={16} />,
    'exe': <FileArrowDownIcon size={16} />,
    'dmg': <FileArrowDownIcon size={16} />,
    'deb': <FileArrowDownIcon size={16} />,
    'rpm': <FileArrowDownIcon size={16} />
  };

  return (
    <FileListItemLabel isSelected={isSelected} onClick={() => onSelectItem(id, itemKey, parentKeys)}>
      {iconMap[fileExtension || ''] || <FileIcon size={16} />}
      <span className="file-name line-clamp-1 max-w-full" title={name}>{name}</span>
    </FileListItemLabel>
  );
}
