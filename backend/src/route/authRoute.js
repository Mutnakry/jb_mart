// const express = require('express');
// const router = express.Router();
// const authController = require('../controller/authController'); // Adjust path as needed

// router.post('/register', authController.register);
// router.post('/login', authController.login);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { register, login,updateUser,Users,GetUserID,checkUserPassword } = require('../controller/authController');
router.get('/', Users);
router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', updateUser);
router.get('/:id', GetUserID)
router.get('/check_password/:id', checkUserPassword)
module.exports = router;

