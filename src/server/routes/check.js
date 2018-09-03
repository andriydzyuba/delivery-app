const checkController = require('../controllers/check');
const express = require('express');

const router = express.Router();

router.get('/:track_code', checkController.getCheck); //getting check

module.exports = router;