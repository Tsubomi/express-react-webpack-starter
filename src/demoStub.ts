import { v4 as uuidv4 } from 'uuid';

import type { FileListMap, FileListMapItem } from './types';

function getItemsToAdd (maxItems: number) {
    let numItems = 0;

    const demoItems: FileListMap = new Map();

    while (numItems < maxItems) {
        // Generate a random number between 1 and maxItems - numItems
        let numItemsToAdd = 1;

        // Randomly decide to add files or a directory
        const addDirectory = Math.random() < 0.3; // 30% chance to add a directory
        const uuid = uuidv4();
        // Randomly generate a file extension for files
        const fileExtensions = ['exe', 'txt', 'md', 'js', 'jpg', 'ts', 'tsx', 'json', 'html'];
        const randomExtension = fileExtensions[Math.floor(Math.random() * fileExtensions.length)];
        const itemName = addDirectory ? `Directory ${uuid}` : `File ${uuid}.${randomExtension}`;
        let itemToAdd: FileListMapItem;
        if (addDirectory) {
            // numItemsToAdd = Math.floor(Math.random() * (maxItems - numItems + 1)) + 1;
            itemToAdd = { id: uuid, name: itemName, type: 'directory', files: getItemsToAdd(numItemsToAdd) };
            numItemsToAdd++; // +1 for the directory itself
        } else {
            itemToAdd = { id: uuid, name: itemName, type: 'file' };
        }

        demoItems.set(itemName, itemToAdd);
        numItems += numItemsToAdd;
    }

    return demoItems;
}

/**
 * Return an array of demo items to add to FileExplorer items through startDemo
 * and addNewItem functions
 *
 * @return  ListItemMap
 */
export default function getDemoItems() {
    const maxItems = 10000;
    return getItemsToAdd(maxItems);
}
