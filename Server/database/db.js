import mongoose from "mongoose";

 export const Connectdb = async () => {
    try {
        await mongoose.connect(" mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.0",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB connected");
        
    } catch (error) {
        console.log("Error connecting to MongoDB", error);   
    }
    
}