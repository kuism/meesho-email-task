const express = require('express');

const router = express.Router();

router.use('/email_histories', require('./email_histories'));

module.exports = router;
