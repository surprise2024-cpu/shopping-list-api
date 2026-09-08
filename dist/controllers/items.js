"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.addItem = exports.getItemById = exports.getAllItems = void 0;
// In-memory storage for items
let items = [];
// Variable to keep track of the current ID for new items
let currentId = 1;
// Function to retrieve all items
const getAllItems = () => {
    return items;
};
exports.getAllItems = getAllItems;
// Function to retrieve an item by its ID
const getItemById = (id) => {
    const item = items.find((item) => item.id === id);
    return item;
};
exports.getItemById = getItemById;
// Function to add a new item
const addItem = (name, quantity, purchased = false) => {
    const newItem = {
        id: currentId++,
        name,
        quantity,
        purchased
    };
    items.push(newItem);
    return newItem;
};
exports.addItem = addItem;
// updating an already existing item
const updateItem = (id, name, quantity, purchased) => {
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
exports.updateItem = updateItem;
// Function to delete an item
const deleteItem = (id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return false;
    }
    items.splice(itemIndex, 1);
    return true;
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=items.js.map