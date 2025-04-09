const express = require('express')
const apiController = require('../controller/ApiController')
const router = express.Router()
const {AuthCheck} = require('../middleware/authCheck')

router.post('/adminSignUp',apiController.adminSignUp)
router.post('/login',apiController.login)
router.get('/sendLoginLink/:id',apiController.sendLoginLink)


router.post('/resetPasswordEmailVerify',apiController.resetPasswordLink)
router.post('/resetPassword/:id/:token',apiController.resetPassword)

router.post('/userRegister',AuthCheck,apiController.createUser)
router.post('/editUser/:id',AuthCheck,apiController.editUser)

router.get('/delete/:id',AuthCheck,apiController.deleteUser)
router.get('/logout',AuthCheck,apiController.logout)


module.exports = router ;
