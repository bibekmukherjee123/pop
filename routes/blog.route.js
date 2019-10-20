const express = require('express');
const router = express.Router();


const blog_controller = require('../controllers/blog.controller');


router.post('/create', blog_controller.blog_create);

router.get('/read/:id', blog_controller.blog_details);

router.get('/read', blog_controller.blog_details);

router.put('/update/:id', blog_controller.blog_update);

router.delete('/delete/:id', blog_controller.blog_delete);

module.exports = router;