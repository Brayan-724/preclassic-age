#!/bin/env node
import express from 'express';
import http from 'http';
const app = express();
const server = http.createServer(app);
app.use(express.static(process.argv[3] || "/storage/self/primary/My_Documents/Designs"));
app.use((_req, res) => {
    res.sendStatus(404);
});
server.listen(parseInt(process.argv[2], 10) || 1403, () => {
    console.log("Server initialized on " + (process.argv[2] || 1403));
});
