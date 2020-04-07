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

// comment must contain text and post_id
// insertComment takes a comment object, returns the comment id object
router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  const id = req.params.id;

  if (comment.text === "") {
    res
      .status(404)
      .json({ errorMessage: "Please provide text for the comment" });
  }

  Posts.findById(id)
    .then((post) => {
      Posts.insertComment(comment)
        .then((id) => {
          Posts.findCommentById(id.id).then((comment) => {
            res.status(201).json(comment);
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            errorMessage: "The post with the specified ID does not exist",
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        error: "There was an error while saving the comment to the database",
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
