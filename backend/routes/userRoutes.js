const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const { getUserPerformance } = require("../controllers/userController");

router.get('/get-dashboard-info/:id', authMiddleware, getUserPerformance);

module.exports = router;