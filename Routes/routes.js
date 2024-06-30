const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');  
const jsonParser = bodyParser.json();
let register = require('../App/resident-register');
const authenticateToken = require('../General/validateRequest'); 

router.get('/resident-register/industry-change-applications/:id', authenticateToken, register.getIndustryChangeApplicationById);
router.get('/resident-register/industry-change-applications', jsonParser, authenticateToken, register.getIndustryChangeApplication);
router.post('/resident-register/delete-industry-change-applications/:id', authenticateToken, register.deleteIndustryChangeApplicationById);

router.post("/resident-register/industry-change-applications", jsonParser, authenticateToken, register.addIndustryChangeApplication);

module.exports = router;