// ServerResponse represents the respons my server send back to the client.
import { ServerResponse } from "http";

export const sendSuccess = (

    res: ServerResponse, 
    statusCode: number, // http status code
    data: unknown // data to end

): void => {

    // sets information about the HTTP response
    // sets status code first
    res.writeHead(statusCode, {
        'content-type': 'application/json' // tells client that the data being sent back is JSON
    });

    // sends response back to the client and ends the request
    // once res.end() runs, the server is finished responding.
    res.end(
        // JSON.stringify converts a javascript object into json text
        JSON.stringify({
            success: true, // tells client that the request worked
            data // puts received data into response
        })
    );

};

export const sendError = (

    res: ServerResponse,
    statusCode: number,
    message: string // error message you want to send

): void => {

    res.writeHead(statusCode, {
        'content-type': 'application/json'
    });

    res.end(
        JSON.stringify({
            success: false,
            error: message
        })
    );
    
};

