import { IncomingMessage, ServerResponse } from "http"; 

import { getAllItems, getItemById, addItem, updateItem, deleteItem } from "../controllers/items";

//http://localhost:4001/items (items endpoint)
//http://localhost:4001/items/:id (items by id endpoint)

// Route handler for items
export const itemsRoute = (
    req: IncomingMessage, 
    res: ServerResponse

) => {

    // Check if the request URL starts with '/items'
    if(req.url?.startsWith('/items')) {

        // Split the URL into parts to extract the item ID if present
        const parts = req.url.split('/');
        
        // Extract the item ID from the URL if it exists
        const idPart = parts[2];

        const id = idPart !== undefined ? Number(idPart) : undefined;

        // Handle GET request for a specific item by ID
        if(req.method === 'GET' && id === undefined) {

            // If no ID is provided, return all items
            res.writeHead(200, { 
                'content-Type': 'application/json' 
            });

            // Call the getAllItems function to retrieve all items
            res.end(
                JSON.stringify({ 
                    success: true, 
                    data: getAllItems() 
                })
            );

            return;
        }

        // Handle GET request for a specific itme by ID
        if(req.method === 'GET' && id !== undefined) {

            
            if (isNaN(id)) {
                res.writeHead(400, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({ 
                        success: false,
                        error: 'Invalid item id' 
                    })
                );

                return;
            }

            const item = getItemById(id);

            if (!item) {

                res.writeHead(404, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({ 
                        success: false,
                        error: 'Item not found' 
                    })
                );

                return;
            }

            // If the item is found, return it; otherwise, return a 404 error
            res.writeHead(200, { 
                'content-Type': 'application/json' 
            });

            // Call the getItemById function to retrieve the item by ID
            res.end(
                JSON.stringify({
                    success: true,
                    data: item
                })
            );

            return;

        }

        // Handle POST request to add a new item
        if(req.method === 'POST' && id === undefined) {

            let body = '';

            // Listen for data events to accumulate the request body
            req.on("data", (chunk) => {

                // Convert the chunk to a string and append it to the body
                body += chunk.toString();

            });

            // Listen for the end event to process the accumulated request body
            req.on('end', () => {

                try {
                    
                    // Parse the request body as JSON to extract item details
                    const { 
                        name, 
                        quantity, 
                        purchased 
                    } = JSON.parse(body);

                    if (
                        !name || 
                        typeof name !== 'string' ||
                        name.trim() === ''
                    ) {
                        res.writeHead(400, { 
                            'content-Type': 'application/json' 
                        });

                        res.end(
                            JSON.stringify({ 
                                success: false,
                                error: 'Item name is required!' 
                            })
                        );

                        return;
                    }

                    // 
                    if (typeof quantity !== 'number' ||
                        quantity <= 0
                    ) {
                        res.writeHead(400, { 
                            'content-Type': 'application/json' 
                        });

                        res.end(
                            JSON.stringify({ 
                                success: false,
                                error: 'Quantity must be greater than 0' 
                            })
                        );

                        return;
                    }

                    // 
                    if (
                        purchased !== undefined &&
                        typeof purchased !== 'boolean'
                    ) {
                        res.writeHead(400, { 
                            'content-Type': 'application/json' 
                        });

                        res.end(
                            JSON.stringify({ 
                                success: false,
                                error: 'Purchased must be a boolean' 
                            })
                        );

                        return;
                    }

                    // Call the addItem function to add the new item and get the created item object
                    const newItem = addItem(
                        name.trim(), 
                        quantity, 
                        purchased ?? false
                    );

                    // Return a 201 Created response with the newly added item
                    res.writeHead(201, { 
                        'content-Type': 'application/json'
                    });

                    // Send the newly added item as the response
                    res.end(
                        JSON.stringify({
                            success: true, 
                            data: newItem
                        })
                    );

                } catch {
                    res.writeHead(400, { 
                        'content-Type': 'application/json' 
                    });

                    res.end(
                        JSON.stringify({ 
                            success: false,
                            error: 'Invalid JSON payload' 
                        })
                    );
                }

            });

            return;
        }

        // PUT / Updating
        if (req.method === 'PUT' && id !== undefined) {

            if (isNaN(id)) {

                res.writeHead(400, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: 'Invalid item id'
                    })
                );

                return;
            }

            const existingItem = getItemById(id);

            if (!existingItem) {

                res.writeHead(404, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: 'Item not found'
                    })
                );

                return;
            }

            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString();
            });

            req.on('end', () => {

                try {

                    const {
                        name, quantity, purchased
                    } = JSON.parse(body);

                    if (
                        name !== undefined &&
                        (
                            typeof name !== 'string' ||
                            name.trim() === ''
                        )
                    ) {

                        res.writeHead(400, {
                            'content-type': 'application/json'
                        });

                        res.end(
                            JSON.stringify({
                                success: false,
                                error: 'Name must not be an empty string'
                            })
                        );

                        return;
                    }

                    if (
                        quantity !== undefined && 
                        (
                            typeof quantity !== 'number' ||
                            quantity <= 0
                        )
                    ) {

                        res.writeHead(400, {
                            'content-type': 'application/json'
                        });

                        res.end(
                            JSON.stringify({
                                success: false, 
                                error: 'Quantity must be greater than 0'
                            })
                        );

                        return;

                    }

                    if (
                        purchased !== undefined &&
                        typeof purchased !== 'boolean'
                    ) {

                        res.writeHead(400, {
                            'content-type': 'application/json'
                        });

                        res.end(
                            JSON.stringify({
                                success: false,
                                error: 'Purchased must be a boolean'
                            })
                        );

                        return;

                    }

                    const updatedItem = updateItem(
                        id, 
                        name,
                        quantity,
                        purchased
                    );

                    res.writeHead(200, {
                        'content-type': 'application/json'
                    });

                    res.end(
                        JSON.stringify({
                            success: true,
                            data: updatedItem
                        })
                    );

                } catch {

                    res.writeHead(400, {
                        'content-type': 'application/json'
                    });

                    res.end(
                        JSON.stringify({
                            success: false,
                            error: 'Invalid JSON payload'
                        })
                    );

                }
            });

            return;

        }

        // DELETE
        if (req.method === 'DELETE' && id !== undefined) {

            if (isNaN(id)) {

                res.writeHead(400, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: 'Invalid item id'
                    })
                );

                return;
            }

            const deleted = deleteItem(id);

            if (!deleted) {

                res.writeHead(404, {
                    'content-type': 'application/json'
                });

                res.end(
                    JSON.stringify({
                        success: false,
                        error: 'Item not found'
                    })
                );

                return;

            }

            res.writeHead(204);

            res.end();

            return;

        }

        res.writeHead(405, { 
            'content-Type': 'application/json' 
        });

        res.end(
            JSON.stringify({ 
                success: false,
                error: 'Method not allowed on /items'
            })
        );

    }
};