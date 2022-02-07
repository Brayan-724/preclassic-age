#!/bin/env node
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

const PORT = parseInt(process.argv[2]) || 1403;

app.use(express.static(process.argv[3] || "/storage/self/primary/My_Documents/apika"));

app.use((_req, res) => {
  res.sendStatus(404);
});

server.on("error", (e) => {
  console.error(e);
})

server.on("listening", () => {
  console.log("Server initialized on " + PORT);
});

server.listen(PORT);
