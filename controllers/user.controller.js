const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');   
const blacklistTokenModel = require('../models/blacklisttoken.model');


const registerUser = async (req, res) => {
  try {
    const { fullname,email, password } = req.body;

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  console.log(req.body)
};

const loginUser = async (req, res) =>{
    try{
        const {email, password} = req.body;

        const user = await userModel.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({message: 'Invalid email or password'});
        }

      

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({message: 'Invalid email or password'});
        }
       
        const token = user.generateAuthToken();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'Lax', // Adjust based on your requirements
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });


        const userSafe = user.toObject();
        delete userSafe.password;

        

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user
        });
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        firstname: req.user.fullname.firstname,
        lastname: req.user.fullname.lastname,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const logoutUser = async (req, res) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (token) {
      await blacklistTokenModel.create({ token });
    }
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


  module.exports = { registerUser, loginUser, getUserProfile, logoutUser };


