import { IncomingMessage, ServerResponse } from "http"; 

import { getAllSongs, getSongById, addSong } from "../controllers/items";
import { error } from "console";

//http://localhost:4001/songs (songs endpoint)
//http://localhost:4001/songs/:id (song by id endpoint)

// Route handler for songs
export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {

    // Check if the request URL starts with '/songs'
    if(req.url?.startsWith('/songs')) {
        console.log(req.url, 'request url');

        // Split the URL into parts to extract the song ID if present
        const parts = req.url.split('/');
        console.log(parts, 'url parts');

        // Extract the song ID from the URL if it exists
        const id = parts[2] ? parseInt(parts[2]) : undefined;

        // Handle GET request for a specific song by ID
        if(req.method === 'GET' && id === undefined) {

            // If no ID is provided, return all songs
            res.writeHead(200, { 'content-Type': 'application/json' });

            // Call the getAllSongs function to retrieve all songs
            res.end(JSON.stringify(getAllSongs()));

            return;
        }

        // Handle GET request for a specific song by ID
        if(req.method === 'GET' && id !== undefined) {

            
            if (isNaN(id)) {
                res.writeHead(400, {'content-type': 'application/json'});
                res.end(JSON.stringify({ error: 'Invalid song id' }));

                return;
            }

            const song = getSongById(id);
            if (!song) {
                res.writeHead(404, {'content-type': 'application/json'});
                res.end(JSON.stringify({ error: 'Song not found' }));

                return;
            }

            // If the song is found, return it; otherwise, return a 404 error
            res.writeHead(200, { 'content-Type': 'application/json' });

            // Call the getSongById function to retrieve the song by ID
            res.end(JSON.stringify(song));

            return;

        }

        // Handle POST request to add a new song
        if(req.method === 'POST') {

            let body = '';

            // Listen for data events to accumulate the request body
            req.on("data", (chunk) => {

                console.log(chunk, 'chunk');

                // Convert the chunk to a string and append it to the body
                body += chunk.toString();

                console.log(body, 'body');
            });

            // Listen for the end event to process the accumulated request body
            req.on('end', () => {

                try {
                    
                    // Parse the request body as JSON to extract song details
                    const { title, artist, duration } = JSON.parse(body);

                    if (!title || typeof title !== 'string') {
                        res.writeHead(400, { 'content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Song title is required!' }));
                        return;
                    }

                    // 
                    if (!artist || typeof artist !== 'string') {
                        res.writeHead(400, { 'content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Artist is required!' }));
                        return;
                    }

                    // 
                    if (!duration || typeof duration !== 'number') {
                        res.writeHead(400, { 'content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Duration is required!' }))
                        return;
                    }

                    // Call the addSong function to add the new song and get the created song object
                    const newSong = addSong(title, artist, duration);

                    // Return a 201 Created response with the newly added song
                    res.writeHead(201, { 'content-Type': 'application/json' });

                    // Send the newly added song as the response
                    res.end(JSON.stringify(newSong))

                } catch (error) {
                    res.writeHead(400, { 'content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid JSON payload' }))
                }

            });

            return;
        }

        res.writeHead(405, { 'content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed on /songs' }))

    }
}