import { Item } from '../models/items';

// In-memory storage for items
let items: Item[] = [];

// Variable to keep track of the current ID for new items
let currentId = 1;

// Function to retrieve all items
export const getAllItems = (): Item[] => {
    return items;
}

// Function to retrieve an item by its ID
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
    const newItem: Item = {
        id: currentId++,
        name,
        quantity, 
        purchased
    };

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

    const item = items.find((item) => item.id === id);

    if (!item) {
        return undefined;
    }

    if (name !== undefined) {
        item.name = name;
    }

    if (quantity !== undefined) {
        item.quantity = quantity;
    }

    if (purchased !== undefined) {
        item.purchased = purchased;
    }

    return item;
};

// Function to delete an item
export const deleteItem = (id: number): boolean => {

    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
        return false;
    }

    items.splice(itemIndex, 1);

    return true;
};


