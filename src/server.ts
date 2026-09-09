import http, {IncomingMessage, ServerResponse} from 'http';
import { itemRoute } from './routes/items';

const PORT = 4002;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {

    console.log(`${req.method} ${req.url}`);

    // Check if the request URL starts with '/songs' and route accordingly
    if(req.url?.startsWith('/items')) {
        itemRoute(req, res);
    }
    else { // If the request URL does not match any specific route, return a default response
        res.writeHead(404, {'content-type': 'application/json'});
        res.end(JSON.stringify({ success: false, error: 'Route not found!' }));
    }
};

// Create the HTTP server and listen on the specified port
const server = http.createServer(requestListener);

// 
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

