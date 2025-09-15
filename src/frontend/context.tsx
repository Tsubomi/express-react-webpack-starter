import { createContext } from "react";

import type { FileListMap } from "../types";

export const ExplorerItemsContext = createContext<FileListMap>(new Map());
export const SelectedItemIdContext = createContext<string | null>(null);
export const RootDirectoryContext = createContext<string>('root');
export const DialogueOpenContext = createContext<boolean>(false);
