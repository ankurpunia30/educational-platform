const express = require('express');
const router = express.Router();
const {userValidationRules,validateUser}=require('../middleware/validateInput');

const {    userRegistration,
    userLogin,
    userLogout,
    userForgotPassword,
    userResetPassword,
    deleteUser,
    updateUser,
    getUser
}=require('../controllers/userAuthentication');



//register a user
router.post('/register',userRegistration);

//login a user

router.post('/login',userLogin);

//fetching profile

router.get('/profile',getUser);


//updating profile

router.put('/update',updateUser);

//deleting profile

router.delete('/delete',deleteUser);

//logout
router.post('/logout',userLogout);

//forgot password
router.post('/forgot-password',userForgotPassword);

//reset password
router.put('/reset-password',userResetPassword);


module.exports = router;