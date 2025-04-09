const express = require('express')
const router = express.Router()
const staticController = require('../controller/staticController')
const {AuthCheck} = require('../middleware/authCheck')


router.get('/adminRegister',staticController.adminRegister)
router.get('/login',staticController.login)
router.get('/resetPasswordLinkPg1',staticController.resetPasswordLinkPgFirst)
router.get('/resetPasswordLinkPg2/:id/:token',staticController.resetPasswordLinkPgSecond)


// router.all('/*',authCheck)
router.get('/adminDash',AuthCheck,staticController.adminDashbord)
router.get('/userDash/:id',AuthCheck,staticController.userDashbord)
router.get('/createUser',AuthCheck,staticController.createUser)
router.get('/editUser/:id',AuthCheck,staticController.editUser)



module.exports = router ;