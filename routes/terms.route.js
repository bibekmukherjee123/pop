const express = require('express');
const router = express.Router();


const terms_controller = require('../controllers/terms.controller');


// router.post('/create', terms_controller.terms_create);
router.get('/read', terms_controller.terms_details);
router.put('/update/:id', terms_controller.terms_update);

module.exports = router;