const express = require('express');
const router = express.Router();


const social_controller = require('../controllers/social.controller');


router.post('/create', social_controller.social_create);
router.get('/read', social_controller.social_details);
router.put('/update/:id', social_controller.social_update);

module.exports = router;