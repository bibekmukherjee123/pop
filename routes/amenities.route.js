const express = require('express');
const router = express.Router();


const amenities_controller = require('../controllers/amenities.controller');


router.post('/create', amenities_controller.amenities_create);

router.get('/read/:id', amenities_controller.amenities_details);

router.get('/read', amenities_controller.amenities_details);

router.get('/list', amenities_controller.amenities_list);

router.put('/update/:id', amenities_controller.amenities_update);

router.put('/delete/:id', amenities_controller.amenities_delete);

router.get('/custom/search', amenities_controller.amenities_search);

module.exports = router;