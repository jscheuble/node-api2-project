const express = require("express");

const postsRouter = require("./router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.listen(4001, () => {
  console.log("\n\n*** Server running on port 4001 *** \n\n");
});
