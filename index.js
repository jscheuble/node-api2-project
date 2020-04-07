const express = require("express");

const server = express();

server.listen(4001, () => {
  console.log("\n\n*** Server running on port 4001 *** \n\n");
});
