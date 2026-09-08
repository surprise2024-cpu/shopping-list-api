import http, {IncomingMessage, ServerResponse} from 'http';
import { songsRoute } from './routes/songs';

const PORT = 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {

    console.log(req.url, 'url');

    // Check if the request URL starts with '/songs' and route accordingly
    if(req.url?.startsWith('/songs')) {
        songsRoute(req, res);
    }
    else { // If the request URL does not match any specific route, return a default response
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify({ message: 'Hello World' }))
    }

    

}

// Create the HTTP server and listen on the specified port
const server = http.createServer(requestListener);

// 
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

