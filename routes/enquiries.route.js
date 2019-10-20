const express = require('express');
const router = express.Router();


const enquiry_controller = require('../controllers/enquiries.controller');

router.post('/shoot/create', enquiry_controller.shoot_enquiry_create);

router.get('/shoot/read/:id', enquiry_controller.shoot_enquiry_details);

router.get('/shoot/read', enquiry_controller.shoot_enquiry_details);

router.get('/shoot/custom/search', enquiry_controller.shoot_enquiry_search);

router.delete('/shoot/delete/:id', enquiry_controller.shoot_enquiry_delete);

router.get('/shoot/exportcsv', enquiry_controller.shoot_generate_csv);

router.post('/property/create', enquiry_controller.property_enquiry_create);

router.get('/property/read/:id', enquiry_controller.property_enquiry_details);

router.get('/property/read', enquiry_controller.property_enquiry_details);

router.delete('/property/delete/:id', enquiry_controller.property_enquiry_delete);

router.get('/property/custom/search', enquiry_controller.property_enquiry_search);

router.get('/property/exportcsv', enquiry_controller.property_generate_csv);

module.exports = router;