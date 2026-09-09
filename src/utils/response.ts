import { ServerResponse } from "http";

export const sendSuccess = (

    res: ServerResponse,
    statusCode: number,
    data: unknown

): void => {

    res.writeHead(statusCode, {
        'content-type': 'application/json'
    });

    res.end(
        JSON.stringify({
            success: true,
            data
        })
    );

};

export const sendError = (

    res: ServerResponse,
    statusCode: number,
    message: string

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

