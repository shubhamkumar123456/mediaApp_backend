const express = require('express');
const { createUser, loginUser, updateUser, deleteUser, forgetPassword, resetPassword, passwordReset, getUserDetails, getUserbyName, getUserbyId, followUser } = require('../controllers/userController');
const checkToken = require('../middleware/checkToken');
const router = express.Router();


router.post('/create', createUser);
router.post('/login', loginUser);
router.put('/update/:_id', checkToken, updateUser)
router.delete('/delete', checkToken, deleteUser);
router.post('/forgetPassword', forgetPassword)
router.get('/resetToken/:token',resetPassword)
router.post('/resetToken/:token',passwordReset);
router.get('/getUser',checkToken,getUserDetails)
router.get('/username',getUserbyName)
router.get('/getuser/:_id',getUserbyId);
router.post('/followuser/:_id',checkToken,followUser)



module.exports = router