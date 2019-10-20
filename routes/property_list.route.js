const express = require('express');
const router = express.Router();


const property_list_controller = require('../controllers/property_list.controller');


router.post('/create', property_list_controller.property_list_create);

router.get('/read/:id', property_list_controller.property_list_details);

router.get('/read', property_list_controller.property_list_details);

router.post('/search', property_list_controller.property_list_location_details);

router.get('/all', property_list_controller.property_list_user_property);

router.put('/update/:id', property_list_controller.property_list_update);

router.put('/delete/:id', property_list_controller.property_list_delete);

router.get('/custom/search', property_list_controller.property_list_search);

router.get('/userList', property_list_controller.property_list_all_user_property);

module.exports = router;