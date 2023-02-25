const express = require('express');
let router = express.Router();
const webhook = require('./webhook');
router.post('/api/webhook', webhook);

module.exports = router;
