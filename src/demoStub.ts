import { v4 as uuidv4 } from 'uuid';

function getFilesData (count: number) {
    const files = [];
    for (let i = 1; i <= count; i++) {
        files.push({ id: `file0${i}.txt`, name: `file${i}.txt`, type: 'file' });
    }
    return files;
};

export type DemoFileData = {
    name: string;
}

export type DemoDirectoryData = {
    name: string;
    files?: DemoDirectoryFileListItem[];
};

export type DemoDirectoryFileListItem = DemoFileData | DemoDirectoryData;

/**
 * Return an array of demo items to add to FileExplorer items through startDemo
 * and addNewItem functions
 *
 * @return  DemoDirectoryFileListItem[]
 */
export default function getDemoItems() {
    const maxItems = 50;
    let numItems = 0;

    let demoItems: DemoDirectoryFileListItem[] = [];

    while (numItems < maxItems) {
        // Generate a random number between 1 and maxItems - numItems
        const numItemsToAdd = Math.floor(Math.random() * (maxItems - numItems + 1)) + 1;

        // Randomly decide to add files or a directory
        const addDirectory = Math.random() < 0.3; // 30% chance to add a directory

        if (addDirectory) {
            // generate a directory with numItemsToAdd files
            const dirId = `dir-${uuidv4()}`;
            const dirName = `Directory ${dirId.substring(0, 8)}`;
            const filesInDir = getFilesData(numItemsToAdd);

            demoItems.push({ name: dirName, files: filesInDir });

            numItems += numItemsToAdd + 1; // +1 for the directory itself
        } else {
            demoItems = [...demoItems, ...getFilesData(numItemsToAdd)];
            // generate numItemsToAdd files
            numItems += numItemsToAdd;
        }
    }

    return demoItems;
}
