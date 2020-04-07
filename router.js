const express = require("express");

const router = express.Router();
const Posts = require("./data/db.js");

// insert returns a promise with the id of inserted post
router.post("/", (req, res) => {
  console.log(req.body);
  if (req.body.title === "" || req.body.contents === "") {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post ",
    });
  }
  Posts.insert(req.body)
    .then((id) => {
      Posts.findById(id.id)
        .then((post) => {
          res.status(201).json(post);
        })
        .catch((err) => {
          res
            .status(404)
            .json({ errorMessage: "There was an error retrieving your post" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errorMessage:
          "There was an error while saving your post to the database",
      });
    });
});

router.get("/", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved" });
    });
});

module.exports = router;
