const express = require('express');
const router = express.Router();


router.get('/amenities', function(req, res) {

    res.sendFile(path.join(__dirname + '/public/admin/amenities.html'));
});

router.get('/read', amenities_controller.amenities_details);

router.put('/update/:id', amenities_controller.amenities_update);

router.delete('/delete/:id', amenities_controller.amenities_delete);

module.exports = router;