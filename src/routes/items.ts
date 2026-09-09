import { IncomingMessage, ServerResponse } from "http"; 

import { 
    getAllItems, 
    getItemById, 
    addItem, 
    updateItem, 
    deleteItem 
} from "../controllers/items";

import { 
    sendSuccess,
    sendError
} from '../utils/response'



//http://localhost:4002/items (items endpoint)
//http://localhost:4002/items/:id (items by id endpoint)

// Route handler for items
export const itemsRoute = (

    req: IncomingMessage, 
    res: ServerResponse

): void => {

    // Check if the request URL starts with '/items'
    if(req.url?.startsWith('/items')) {

        // Split the URL into parts to extract the item ID if present
        const parts = req.url.split('/');
        
        // Extract the item ID from the URL if it exists
        const idPart = parts[2];

        const id = idPart !== undefined ? Number(idPart) : undefined;

        // Handle GET request for a specific item by ID
        if(req.method === 'GET' && id === undefined) {

            sendSuccess(
                res,
                200, 
                getAllItems()
            );

            return;
        }

        // Handle GET request for a specific itme by ID
        if(req.method === 'GET' && id !== undefined) {

            // valdite id
            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {
         
                sendError(
                    res,
                    400,
                    'Invalid item id'
                );

                return;
            }

            const item = getItemById(id);

            // check if item exists
            if (!item) {

                sendError(
                    res,
                    404,
                    'Item not found'
                );

                return;
            }

            sendSuccess(
                res,
                200,
                item
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

                    // valadite name
                    if (
                        !name || 
                        typeof name !== 'string' ||
                        name.trim() === ''
                    ) {

                        sendError(
                            res,
                            400,
                            'item name is required'
                        );

                        return;
                    }

                    // validate quantity
                    if (typeof quantity !== 'number' ||
                        quantity <= 0
                    ) {
                        
                        sendError(
                            res,
                            400,
                            'Quantity must be greater than 0'
                        );

                        return;
                    }

                    // Validate purchased
                    if (
                        purchased !== undefined &&
                        typeof purchased !== 'boolean'
                    ) {
                 
                        sendError(
                            res,
                            400,
                            'Purchased must be a boolean'
                        );

                        return;
                    }

                    // Call the addItem function to add the new item and get the created item object
                    const newItem = addItem(
                        name.trim(), 
                        quantity, 
                        purchased ?? false
                    );

                    sendSuccess(
                        res,
                        201,
                        newItem
                    );


                } catch {

                    sendError(
                        res,
                        400,
                        'Invalid JSON payload'
                    );
                   
                }

            });

            return;
        }

        // PUT / Updating
        if (req.method === 'PUT' && id !== undefined) {

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                sendError(
                    res, 
                    400,
                    'Invalid item id'
                );

                return;
            }

            const existingItem = getItemById(id);

            if (!existingItem) {

                sendError(
                    res,
                    404,
                    'Item not found'
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

                        sendError(
                            res, 
                            400,
                            'Name must not be an empty string'
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

                        sendError(
                            res,
                            400,
                            'Quantity must be greater than 0'
                        );

                        return;

                    }

                    if (
                        purchased !== undefined &&
                        typeof purchased !== 'boolean'
                    ) {

                        sendError(
                            res,
                            400,
                            'Purchased must be a boolean (true/false)'
                        );

                        return;

                    }

                    const updatedItem = updateItem(
                        id, 
                        name,
                        quantity,
                        purchased
                    );

                    sendSuccess(
                        res, 
                        200,
                        updatedItem
                    );

                } catch {

                    sendError(
                        res, 
                        400,
                        'Invalid JSON payload'
                    );

                }
            });

            return;

        }

        // DELETE /items/:id
        if (req.method === 'DELETE' && id !== undefined) {

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                sendError(
                    res,
                    400,
                    'Invalid item id'
                );

                return;

            }

            const deleted = deleteItem(id);

            if (!deleted) {

                sendError(
                    res,
                    404,
                    'Item not found'
                );

                return;

            }

            res.writeHead(204);

            res.end();

            return;

        }

        sendError(
            res,
            405,
            'Method not allowed on /items'
        );

    }

};