// implement your posts router here
const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    !post ? res.status(404).json({ message: 'The post with the specified ID does not exist' })
      : res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'The post information could not be retrieved' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    !post ? res.status(404).json({ message: 'The post with the specified ID does not exist' })
      : await Post.remove(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'The post could not be removed' });
  }
});

router.post('/', async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ message: 'Please provide title and contents for the post' });
  } else {
    try {
      const { id } = await Post.insert(req.body);
      const post = await Post.findById(id);
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({
        message: 'There was an error while saving the post to the database',
      });
    }
  }
});

router.put('/:id', async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({ message: 'Please provide title and contents for the post' });
  } else {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        res.status(404).json({ message: 'The post with the specified ID does not exist' });
      } else {
        await Post.update(req.params.id, req.body);
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
      }
    } catch (err) {
      res.status(500).json({ message: 'The post information could not be modified' });
    }
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist' });
    } else {
      const comments = await Post.findPostComments(req.params.id);
      res.json(comments);
    }
  } catch (err) {
    res.status(500).json({ message: 'The comments information could not be retrieved' });
  }
});

module.exports = router;