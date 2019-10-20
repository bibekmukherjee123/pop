const express = require('express');
const router = express.Router();


const vr_controller = require('../controllers/tourupload.controller');


// router.post('/create', terms_controller.terms_create);
router.post('/tourupload', vr_controller.vr_upload);

module.exports = router;