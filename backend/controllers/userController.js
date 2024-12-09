import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";

const createToken= (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Route for User Login 
const loginUser = async (req,res) =>{

}

// Router for User Register 
const registerUser = async (req,res) => {
    try {
        const {name, email, password} = req.body
        // Checking user already exists or not 

        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false , message :"User Already Exist"})
        }

        //Validating email format & strong Password 

        if (!validator.isEmail(email)) {
            return res.json({success:false , message:"Please enter a valid email "});
        }
        if (password.length < 8 ) {
            return res.json({success:false , message:"Please enter a strong Password  "});
        }

        // Hash Pssword 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = new userModel({
            name,
            email,
            password:hashedPassword
        });

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// Router for Admin Login
const adminLogin = async (req,res)=>{

}

export { loginUser , registerUser, adminLogin }