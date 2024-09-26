import { hashPassword,comparePassword } from "../helpers/index.js";
import  jwt  from "jsonwebtoken";
import User from "../models/user.js";



export const register = async (req, res)=>{
    try {
        const { firstName, lastName, userName, email, password } = req.body;
        // console.log(req.body);

        // Handle validation
        if(!firstName){
            return res.status(400).json({success:false,message:"First name is required."});
        }
        if(!lastName){
            return res.status(400).json({success:false,message:"Last name is required."});
        }
        if(!userName){
            return res.status(400).json({success:false,message:"userName is taken."});
        }
        if(!email){
            return res.status(400).json({success:false,message:"Email is required."});
        }
        if(! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return res.status(400).json({success:false,message:"Invalid email format."});
        }
        if(!password){
            return res.status(400).json({success:false,message:"Password is required."});
        }
        if(!password || password.length <6){
            return res.status(400).json({success:false,message:"Password must be at least 6 characters long."});
        }

        // check if email already exists
        const userExists = await User.findOne ({email: email});
        if(userExists){
            return res.status(400).json({success: false, message: "Email already exists"})
        }


        // check if userName is taken 
        const userNameTaken = await User.findOne ({userName: userName});
        if(userNameTaken){
            return res.status(400).json({success: false, message: ` username "${userName}" already taken`})
        }
        
        // hashing user password 
        const hashedPassword =await hashPassword(password);
  
        // create a new user
        const user =new User({
            firstName,
            lastName,
            userName,
            email,
            password:hashedPassword,
        })

        // save the user to the database 
        await user.save();

        // Generate a token 
        const token =jwt.sign ({id:user._id}, process.env.JWT_SECRET,{expiresIn: "2h"});

        // send response 
        return res.json({success:true, message:'Registration successful', 
            user:{
                firstName:user.firstName,
                lastName:user.lastName,
                userName:user.userName,
                email:user.email,
                role:user.role,
                token
                
            }});
    } catch (err) {
        console.error(err);
        res.status(500).json({success:false, message: "Registration failed", error: err.message});
    }
    
}



export const login = async (req, res) => {
    try { 
        const { userName, password } = req.body;

        // Check if username is provided
        if (!userName) {
            return res.status(404).json({ success: false, message: 'Username is required' });
        }

        // Check if password is provided
        if (!password) {
            return res.status(404).json({ success: false, message: 'Password is required' });
        }

        // Find user by username
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        console.log(user);
        

        // Now, use your imported comparePassword function to verify the password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

        // Send response with user details and token
        return res.json({
            success: true,
            message: "Login successful",
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.userName,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Login failed', error: err.message });
    }
};

// forgotPassword

// resetPassword

// socialAuth e.g GoogleAuth