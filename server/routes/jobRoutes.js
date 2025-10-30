const express = require('express');
const router = express.Router();
const { importJobs, getImportHistory } = require('../controller/jobController');


router.get('/import', importJobs);


router.get('/history', getImportHistory);

module.exports = router;
