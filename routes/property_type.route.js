const express = require('express');
const router = express.Router();


const property_type_controller = require('../controllers/property_type.controller');


router.post('/create', property_type_controller.property_type_create);

router.get('/read/:id', property_type_controller.property_type_details);

router.get('/read', property_type_controller.property_type_details);

router.get('/list', property_type_controller.property_type_list);

router.put('/update/:id', property_type_controller.property_type_update);

router.put('/delete/:id', property_type_controller.property_type_delete);

router.get('/custom/search', property_type_controller.property_type_search);

module.exports = router;