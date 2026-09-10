// Incoming message represents the request coming into the server.
// ServerResponse represents the response your server sends back.
import { IncomingMessage, ServerResponse } from "http"; 

// importing my controller functions
import { 
    getAllItems, 
    getItemById, 
    addItem, 
    updateItem, 
    deleteItem 
} from "../controllers/items";

// import my helper functions
import { 
    sendSuccess,
    sendError
} from '../utils/response'


//http://localhost:4002/items (items endpoint)
//http://localhost:4002/items/:id (items by id endpoint)

// Route handler for items
export const itemsRoute = (

    req: IncomingMessage, // Incoming data request
    res: ServerResponse // Response depending on the request

    // function does not return a value
): void => {

    // Check if the request URL starts with '/items'
    if(req.url?.startsWith('/items')) {

        // Split the URL into parts to extract the item ID if present
        const parts = req.url.split('/');
        
        // Extract the item ID from the URL if it exists
        const idPart = parts[2];

        // convert id from text into a number
        const id = idPart !== undefined ? Number(idPart) : undefined;

        // Handle GET request items
        if(req.method === 'GET' && id === undefined) {

            sendSuccess(
                res,
                200, // Ok
                getAllItems()
            );

            // stops the route function
            return;
        }

        // Handle GET request for a specific item by ID
        if(req.method === 'GET' && id !== undefined) {

            // valdites id
            if (
                // checks whether id is a whole number (1 -> etc)
                !Number.isInteger(id) ||
                id <= 0
            ) {
         
                sendError(
                    res,
                    400, // Bad Request
                    'Invalid item id'
                );

                // stops the function
                return;
            }

            // searches for item by its ID
            const item = getItemById(id);

            // check if item exists
            if (!item) {

                sendError(
                    res,
                    404, // Not Found
                    'Item not found'
                );

                return;
            }

            sendSuccess(
                res,
                200, // Ok
                item
            );

            return;

        }

        // Handle POST request to create a new item
        if(req.method === 'POST' && id === undefined) {

            // creates an empty string
            let body = '';

            // Node.js receives incoming request data in small pieces called chuncks
            req.on("data", (chunk) => {

                // Convert the chunk to a string and append it to the body
                body += chunk.toString();

            });

            // Runs after Node has finished receiving the entire request body
            req.on('end', () => {

                try {
                    
                    // Turns the JSON text into a JavaScript object
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
                        201, // Created successfully
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

            // validates ID
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

            // before updating, first check if the item exists
            const existingItem = getItemById(id);

            // if item does not exist
            if (!existingItem) {

                sendError(
                    res,
                    404,
                    'Item not found'
                );

                return;
            }

            // empty string that stores the incoming update data
            let body = '';

            // listens for pieces of incoming data
            req.on('data', (chunk) => {
                // turns incoming pieces of data into a text and appends it
                body += chunk.toString(); 
            });

            // once the entire body has arrived, start processing it
            req.on('end', () => {

                try {

                    // convert request body into a javascript object
                    const {
                        name, 
                        quantity, 
                        purchased
                        
                    } = JSON.parse(body);

                    if (// only validate the name if a new name was provided.
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

                    if (// only validate the quantity if a new quantity was provided.
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

                    if (// if purchased was provided, make sure that it it true/false
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

                    // where the updating actually takes place
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

            // validate ID
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

            // call controller to delete specific item by its ID
            const deleted = deleteItem(id);

            // if deletion fails
            if (!deleted) {

                sendError(
                    res,
                    404,
                    'Item not found'
                );

                return;

            }

            // if deletion succeeds set http status to No Content
            res.writeHead(204);

            // finish the http reponse
            res.end();

            // stop processing the request
            return;

        }

        // if none of the previous routes matched
        sendError(
            res,
            405,
            'Method not allowed on /items'
        );

    }

};