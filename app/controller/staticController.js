const User = require('../model/userModel')


class staticController{

    async adminRegister(req,res){
        try {
            return res.render('adminRegister',{
                title: "Admin Sign Up"
            });
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    async login(req,res){
        try {
            return res.render('login',{
                title: "Admin User Login"
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    async resetPasswordLinkPgFirst(req,res){
        try {
            return res.render('resetPass1st',{
                title: "Reset Password Link"
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    async resetPasswordLinkPgSecond(req,res){
        try {
            const {id,token} = req.params
            return res.render('resetPass2nd',{
                title: "Reset Password Link",
                id,
                token
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    async createUser(req,res){
        try {
           return res.render('createUser')
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

    async adminDashbord(req,res){
        try {
            const users = await User.find({});
            return res.render('adminDashbord',{
                users
            })
        } catch (error) {
            
        }
    }

    async userDashbord(req,res){
        try {
            const {id} = req.params
            const user = await User.findOne({ _id: id });
            return res.render('userDashbord',{
                user
            })
        } catch (error) {
            
        }
    }
    

    async editUser(req,res){
        try {
            const {id} = req.params;
            const user = await User.findOne({_id:id})
            return res.render('editUser',{
                title:'Edit Details',
                user ,
            })
        } catch (error) {
            return res.status(400).json({
                status:false ,
                message:error.message
                
            })
        }
    }
}

module.exports = new staticController() ;