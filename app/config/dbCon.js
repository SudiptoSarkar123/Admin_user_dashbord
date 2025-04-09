const mongoose = require('mongoose')

const userDbcon = async ()=>{
    try {
        const dbcon = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database Connected Successfuly...`)
    } catch (error) {
        console.log(`Failed to connect Database...`)
    }
}

module.exports = userDbcon