import e from "cors";
import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "moderator"]
        
    },
    skills:[String],
    createdAt:{
        type: Date,
        default: Date.now
    }
    

},{timestamps:true});



export default mongoose.model("User",userSchema);