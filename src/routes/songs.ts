import { IncomingMessage, ServerResponse } from "http"; 

import { getAllSongs, getSongById, addSong } from "../controllers/songs";

//http://localhost:4000/songs (songs endpoint)
//http://localhost:4000/songs/:id (song by id endpoint)

// Route handler for songs
export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {

    // Check if the request URL starts with '/songs'
    if(req.url?.startsWith('/songs')) {
        console.log(req.url, 'request url');

        // Split the URL into parts to extract the song ID if present
        const parts = req.url.split('/');
        console.log(parts, 'request url parts');

        // Extract the song ID from the URL if it exists
        const id = parts[2] ? parseInt(parts[2]) : undefined;

        // Handle GET request for a specific song by ID
        if(req.method === 'GET' && !id) {

            // If no ID is provided, return all songs
            res.writeHead(200, { 'content-Type': 'application/json' });

            // Call the getAllSongs function to retrieve all songs
            res.end(JSON.stringify(getAllSongs()));

            return;
        }

        // Handle GET request for a specific song by ID
        if(req.method === 'GET' && id) {

            const song = getSongById(id);

            // If the song is found, return it; otherwise, return a 404 error
            res.writeHead(song ? 200 : 404, { 'content-Type': 'application/json' });

            // Call the getSongById function to retrieve the song by ID
            res.end(JSON.stringify(song || { message: 'Song not found' }));
        }

        // Handle POST request to add a new song
        if(req.method === 'POST') {

            let body = '';

            // Listen for data events to accumulate the request body
            req.on('data', (chunk) => {

                console.log(chunk, 'chunk');

                // Convert the chunk to a string and append it to the body
                body += chunk.toString();

                console.log(body, 'body');
            });

            // Listen for the end event to process the accumulated request body
            req.on('end', () => {

                // Parse the request body as JSON to extract song details
                const { title, artist, duration } = JSON.parse(body);

                // Call the addSong function to add the new song and get the created song object
                const newSong = addSong(title, artist, duration);

                // Return a 201 Created response with the newly added song
                res.writeHead(201, { 'content-Type': 'application/json' });

                // Send the newly added song as the response
                res.end(JSON.stringify(newSong))
            });

            return;
        }


    }
}