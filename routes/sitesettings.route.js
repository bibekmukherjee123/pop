const express = require('express');
const router = express.Router();


const sites_controller = require('../controllers/sitesettings.controller');


router.post('/create', sites_controller.sitesettings_create);

router.get('/read/:id', sites_controller.sitesettings_details);

router.get('/read', sites_controller.sitesettings_details);

router.put('/update/:id', sites_controller.sitesettings_update);


module.exports = router;