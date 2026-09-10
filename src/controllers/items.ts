import { Item } from '../models/items';

// In-memory storage for items
let items: Item[] = [];

// Variable to keep track of the current ID for new items
let currentId = 1;

// Function to retrieve all items
export const getAllItems = (): Item[] => {
    return items;
}

// Function to retrieve an item by its ID, returns undefined if item is not found
export const getItemById = (id: number): Item | undefined => {
    const item = items.find((item) => item.id === id);
    return item;
}

// Function to add a new item
export const addItem = (
    name: string, 
    quantity: number, 
    purchased: boolean = false
 ): Item => {

    // created new object that follows the structure of the Item object
    const newItem: Item = {
        id: currentId++,
        name,
        quantity, 
        purchased
    };

    // .push() Adds the new object to the end of the items array
    items.push(newItem);

    return newItem;
};

// updating an already existing item
export const updateItem = (
    id: number,
    name?: string,
    quantity?: number,
    purchased?: boolean
): Item | undefined => {

    // Searches for the item whose ID matches the id given to the function
    const item = items.find((item) => item.id === id);

    // checks whether item exists
    if (!item) {
        return undefined;
    }

    // checks whether a new name was actually provided
    if (name !== undefined) {
        // updates with the new name
        item.name = name;
    }

    // checks whether a new quantity was actually provided
    if (quantity !== undefined) {
        item.quantity = quantity;
    }

    // checks whether a new purchased status was actually provided
    if (purchased !== undefined) {
        item.purchased = purchased;
    }

    return item;
};

// Function to delete an item
export const deleteItem = (id: number): boolean => {

    // searches for the postion of the item in the array (items)
    const itemIndex = items.findIndex((item) => item.id === id);

    // itemIndex returns -1 if item wasn't found in the array
    if (itemIndex === -1) {

        //tells application that nothing was deleted
        return false;
    }

    // .splice() removes an item from the array depending on its index
    items.splice(itemIndex, 1);

    // deletion succeeded
    return true;
};


