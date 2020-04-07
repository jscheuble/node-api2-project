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
        .catch(() => {
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
    .then(() => {
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

//returns the post object with the specified id
// findById accepts an ID as a parameter and returns the corresponding post or []
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(500).json({
          errorMessage: "The post information could not be retrieved",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist",
      });
    });
});

// findPostComments accepts postId and returns promise w array of all comments
// findCommentById accepts id and returns promise w comment
router.get("/:id/comments", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        Posts.findPostComments(post[0].id).then((comments) => {
          res.status(201).json(comments);
        });
      } else {
        res.status(404).json({
          errorMessage: "The post with the specified ID does not exist",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        errorMessage: "The comments information could not be retrieved",
      });
    });
});

// remove accepts id and returns promise w the number of records deleted
router.delete("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        Posts.remove(req.params.id).then((count) => {
          res.status(201).json({
            errorMessage: `${count} record(s) have been successfully deleted`,
          });
        });
      } else {
        res.status(404).json({
          errorMessage: "the post with the specified ID does not exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ errorMessage: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (req.body.title && req.body.contents) {
        Posts.update(post[0].id, req.body)
          .then(() => {
            Posts.findById(post[0].id).then((post) => {
              res.status(200).json(post);
            });
          })
          .catch(() => {
            res.status(500).json({
              errorMessage: "The post information could not be modified",
            });
          });
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post",
        });
      }
    })
    .catch(() => {
      res.status(404).json({
        errorMessage: "The post with the specified ID does not exist",
      });
    });
});

module.exports = router;
