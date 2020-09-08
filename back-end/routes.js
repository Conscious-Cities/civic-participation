const express = require('express');
const router = express.Router();
const asyncRouter = require('./middleware/asyncRouter');

const login = require('./routes/login');
const createAccount = require('./routes/create_account');
const getAccount = require('./routes/chain/get_account');

// Blockchain API extensions
router.post("/v1/chain/get_account", asyncRouter(getAccount));

// New API endpoints
router.post('/login', asyncRouter(login));
router.post('/create-account', asyncRouter(createAccount));

module.exports = router;