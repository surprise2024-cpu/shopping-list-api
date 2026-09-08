"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const items_1 = require("./routes/items");
const PORT = 4001;
const requestListener = (req, res) => {
    console.log(`${req.method} ${req.url}`);
    // Check if the request URL starts with '/songs' and route accordingly
    if (req.url?.startsWith('/items')) {
        (0, items_1.itemRoute)(req, res);
    }
    else { // If the request URL does not match any specific route, return a default response
        res.writeHead(404, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Route not found!' }));
    }
};
// Create the HTTP server and listen on the specified port
const server = http_1.default.createServer(requestListener);
// 
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map