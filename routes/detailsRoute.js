const express = require('express');
const detailsController = require('../controllers/detailsController');

const router = express.Router();

router.post('/', detailsController.updateDetails);

router.get('/', detailsController.getDetails);


module.exports = router;
