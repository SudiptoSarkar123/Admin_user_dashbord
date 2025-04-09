const Admin = require('../model/adminModel')
const User = require('../model/userModel')
const { hashPassword, comparePassword } = require('../helper/auth');
const jwt = require('jsonwebtoken');
const { sendUserPassword, sendOTP, resetLink } = require('../helper/sendEmailToLogin')
const otpModel = require('../model/otpModel');
const cookieParser = require("cookie-parser")

class apiController {
    async adminSignUp(req, res) {
        try {
            const { name, email, password } = req.body;
            // Ensure All fileds are filled...
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    massage: 'All fileds are required...'
                })
            }

            // Find the Admin if alrady exists ...
            const if_exists = await Admin.findOne({ email })
            if (if_exists) {
                return res.status(400).json({
                    status: false,
                    message: 'Admin Alrady Exists...'
                })
            }
            // Encrypt password 
            const hash = hashPassword(password)

            const data = new Admin({
                name, email,
                password: hash,
                role: 'admin'
            })
            const result = await data.save()

            return res.redirect('/api/login');

        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: false,
                error: error.message
            })
        }
    }

    async  login(req, res) {
        try {
            console.log(req.body)
            if (req.body.role === 'admin') {
                const { email, password } = req.body;
                // Ensure All fileds are filled...
                if (!email || !password) {
                    return res.status(400).json({
                        status: false,
                        massage: 'All fileds are required...'
                    })
                }
                // Find the Admin if alrady exists ...
                const admin = await Admin.findOne({ email })
                if (!admin) {
                    req.flash('error', 'Admin Not Exists...');
                    return res.redirect('/api/login');
                }



                const isMatch = comparePassword(password, admin.password)
                if (!isMatch) {
                    req.flash('error', 'Invalid Password');
                    return res.redirect('/api/login');
                }

                const token = jwt.sign({
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,

                }, process.env.SECRET_KEY, { expiresIn: '30m' })

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 60 * 1000 // 30 minutes
                })

                return res.redirect('/api/adminDash')
            } else if (req.body.role === 'user') {

                const { email, password } = req.body;
                // Ensure All fileds are filled...
                if (!email || !password) {
                    return res.status(400).json({
                        status: false,
                        massage: 'All fileds are required...'
                    })
                }
                // Find the Admin if alrady exists ...
                const user = await User.findOne({ email })
                if (!user) {
                    req.flash('error','User Not Exists...');
                    return res.redirect('/api/login');
                }



                const isMatch = comparePassword(password, user.password1)
                if (!isMatch) {
                    req.flash('error','Invalid Password ');
                    return res.redirect('/api/login');
                }

                const token = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email

                }, process.env.SECRET_KEY, { expiresIn: '30m' })

                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 30 * 60 * 1000 // 30 minutes
                })


                return res.redirect(`/api/userDash/${user._id}`,)
               
            }


        } catch (error) {
            console.log(error)
            return res.redirect('/api/login');
        }
    }

    async sendLoginLink(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findOne({ _id: id })
            sendUserPassword(req, user);
            return res.status(200).json({ status: true, message: 'Password reset link send successfully...' })
        } catch (error) {
            return res.status(400).json({ status: false, error: error.message })
        }
    }


    async createUser(req, res) {
        try {
            const { name, email, password } = req.body;
            // Ensure All fileds are filled...
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: false,
                    massage: 'All fileds are required...'
                })
            }

            // Find the User if alrady exists ...
            const if_exists = await User.findOne({ email })
            // if (if_exists) {
            //     return res.status(400).json({
            //         status: false,
            //         message: 'User Alrady Exists...'
            //     })
            // }
            // Encrypt password 
            const hash = hashPassword(password)

            const data = new User({
                name, email,
                password1: hash,
                password2: password ,
                role: 'user'
            })
            const user = await data.save()
            // const value = sendUserPassword(req, user);

            return res.redirect('/api/adminDash');

            

        } catch (error) {
            console.log(error)
        }
    }

    async resetPasswordLink(req, res) {
        try {
            const { email } = req.body;
            // Ensure All fileds are filled...
            if (!email) {
                return res.status(400).json({
                    status: false,
                    massage: 'All fileds are required...'
                })
            }

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'User Not Exists...'
                })
            }
            // genrerate token for password reset
            resetLink(req, user)
            return res.status(200).json({
                status: true,
                message: 'Password reset link send successfully...'
            })

        } catch (error) {
            return res.status(400).json({
                status: false,
                error: error.message
            })
        }
    }

    async resetPassword(req, res) {
        try {
            const { password, confirmPassword } = req.body;
            const { id, token } = req.params;
            console.log(id, token)
            // Find the User if alrady exists ...
            const user = await User.findOne({ _id: id })
            if (!user) {
                return res.status(400).json({
                    status: false,
                    message: 'User Not Exists...'
                })
            }

            // Ensure All fileds are filled...
            if (!password || !confirmPassword) {
                return res.status(400).json({
                    status: false,
                    massage: 'All fileds are required...'
                })
            }
            const new_secret = user._id + process.env.SECRET_KEY;
            jwt.verify(token, new_secret)

            if (password !== confirmPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Password do not match...'
                })
            }

            const hash = hashPassword(password)
            await User.findByIdAndUpdate({ _id: id }, {
                $set: {
                    password1: hash,
                    password2: password
                }
            })
            

            res.status(200).json({
                status: true,
                message: "Password Reset Successfully..."
                
            })
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                status: false,
                error: error.message
            })
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie('authToken');
            return res.redirect('/api/login')
        } catch (error) {
            return res.status(400).json({
                status: false,
                error: error.message
            })
        }
    }

    async editUser(req, res) {
        try {
            const {id} = req.params 
            const {name,email,role} = req.body
            const user = await User.findOneAndUpdate({ _id: id }, {
                $set: {
                    name,
                    email,
                    role
                }
            })
            return res.redirect('/api/adminDash')


        } catch (error) {
            return res.status(400).json({
                status: false,
                error: error.message
            })
        }
    }

    async deleteUser(req, res) {
        try {
            const {id} = req.params 
            const user = await User.findOneAndDelete({ _id: id })

            return res.redirect('/api/adminDash')
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = new apiController();