const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({

    fullname: {

        firstname: {type: String,
                    required: true, 
                    minlength:[3, 'First name must be at least 3 characters long']
                },
        lastname: {type: String, required: true}
    },

    email: {type: String, 
            required: true, 
            unique: true, 
            minlength:[5, 'Email must be at least 5 characters long']
        },
    password: {type: String, required: true, select: false},

    socketID: {type: String, default: null},
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '7d',});
    return token;
};


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};


const User = mongoose.models.User || mongoose.model('User', userSchema) ;

module.exports = User;