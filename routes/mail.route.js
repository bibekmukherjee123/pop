const express = require('express');
const router = express.Router();
const mail = require('../utils/mail.js');


router.post('/sendMail', (req, res) => {
    let maildata = req.body;
    mail
        .sendmail(maildata)
        .then(response => res.send(response))
        .catch(err => res.send('error'));
});

module.exports = router;