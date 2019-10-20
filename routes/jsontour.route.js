const express = require('express');
const router = express.Router();


const json_tour_controller = require('../controllers/json_tour.controller');


router.post('/create', json_tour_controller.json_tour_create);

router.get('/read/:id', json_tour_controller.json_tour_details);

router.get('/read', json_tour_controller.json_tour_details);

router.put('/update/:id', json_tour_controller.json_tour_update);

// router.delete('/delete/:id', json_tour_controller.json_tour_delete);

module.exports = router;