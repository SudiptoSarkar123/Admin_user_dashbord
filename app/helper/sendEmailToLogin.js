const transporter = require('../config/emailCon')
const sendOTPforEmailverify = require('../model/otpModel')
const jwt = require('jsonwebtoken')

const sendUserPassword = async (req, user) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Login Details',
            html: `<h1>Hello ${user.name}</h1>
            </br><p>User name is ${user.email}
            <p> Your Password is <b>${user.password2}</b></p></br>
            
            <p>Your login link is <b>${req.protocol}://localhost:4005/api/login</b></p>` 
        })
        // http://localhost:4005/api/userRegister
        return 'success'
    } catch (error) {
        console.log(error.message)
    }
}
const sendOTP = async (req, user) => {
    const otp = Math.floor(1000 + Math.random() * 9000)

    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'OTP Verify',
        html: `<h1>Hello ${user.name}</h1>
        </br>
        <p> Your One Time Password(OTP) is <b>${otp}</b></p></br>
        `
    })

    const data = await sendOTPforEmailverify({
        userId: user._id,
        email: user.email,
        otp: otp,

    }).save()



    return otp;
}

const resetLink = async (req, user) => {
    try {
        const secret = user._id + process.env.SECRET_KEY;
        const token = jwt.sign({ userId: user._id, }, secret, { expiresIn: "20m" })
        const resetLink = `${req.protocol}://localhost:4005/api/resetPasswordLinkPg2/${user._id}/${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject:'Password reset link..',
            html: `<p>Hello ${user.name} , Please <a href="${resetLink}">Cleck here</a></p>`
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({ status: false, error: error.message })
    }

}

module.exports = { sendUserPassword, sendOTP, resetLink }