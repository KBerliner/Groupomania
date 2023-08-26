// Installing Dependencies

const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const postCtrl = require('../controllers/post');

// Routing endpoints

router.get('/', auth, postCtrl.allPosts);
router.post('/', auth, multer, postCtrl.createPost);
// router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.updatePost);
router.delete('/:id/', auth, postCtrl.deletePost);
router.delete('/:creatorId/deleteThese', auth, postCtrl.deleteThese);
router.post('/:id/like', postCtrl.likePost);
router.post('/:id/see', postCtrl.see);

// Exporting routes

module.exports = router;