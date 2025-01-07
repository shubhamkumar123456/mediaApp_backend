const mongoose = require('mongoose');
require('dotenv').config()

console.log(process.env.MONGO_URL)
const connectToDB = async()=>{
    try {
    //    let data = await mongoose.connect('mongodb://localhost:27017/mediaApp')
       let data = await mongoose.connect(process.env.MONGO_URL)
       console.log('connected to mongodb successfully')
    } catch (error) {
        console.log('error in connecting mongodb')
    }

//   .then(() => console.log('connected to mongodb successfully'))
//   .catch(()=>console.log('error in connecting mongodb'))
}

module.exports = connectToDB