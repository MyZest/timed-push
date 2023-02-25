const express = require('express');
let router = express.Router();
const webhook = require('./webhook');

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.get('/env', (req, res) => {
  res.send({
    ...process.env,
  });
});
router.post('/api/webhook', webhook);
router.get('/api/webhook', webhook);

module.exports = router;
