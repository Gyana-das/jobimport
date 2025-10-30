
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
//function to configure the db
 const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connected")
    }catch(error){
        console.log("the error is",error);
    }
}
export default connectDb;
