const express = require('express');
const router = express.Router();


const search_tags_controller = require('../controllers/search_tags.controller');


router.post('/create', search_tags_controller.search_tags_create);

router.get('/read/:id', search_tags_controller.search_tags_details);

router.get('/read', search_tags_controller.search_tags_details);

router.get('/list', search_tags_controller.search_tags_list);


router.put('/update/:id', search_tags_controller.search_tags_update);

router.put('/delete/:id', search_tags_controller.search_tags_delete);

router.get('/custom/search', search_tags_controller.search_tags_search);

module.exports = router;