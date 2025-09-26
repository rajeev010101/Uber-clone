const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');    


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

module.exports = { registerUser, loginUser };
