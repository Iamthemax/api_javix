const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your first name!"],
    minLength: [2, "First name must contain at least 2 characters!"],
    maxLength: [200, "First name cannot exceed 100 characters!"]
  },
  lastName: {
    type: String,
    required: [true, "Please provide your last name!"],
    minLength: [2, "Last name must contain at least 2 characters!"],
    maxLength: [200, "Last name cannot exceed 100 characters!"]
  },
  mobile: {
    type: String,
    required: [true, "Please provide your mobile number!"],
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: "Enter a valid 10-digit mobile number!"
    }
  },
  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: [true, "User already registered with entered email !"],
    validate: [validator.isEmail, "Please provide a valid email!"]
  },
  password: {
    type: String,
    required: [true, "Please provide your password!"],
    minLength: [8, "Password must contain at least 8 characters!"]
  },
  roleId: {
    type: String,
    required: [true, "Please provide valid role ID!"],
    minLength: [1, "Role ID must contain at least 1 character!"],
    maxLength: [10, "Role ID cannot exceed 10 characters!"] 
   },
  role: {
    type: String,
    enum: ["admin", "user", "screener", "doctor", "sevika", "pharmacy"],
    default: "user"
  },
  is_active: {
    type: Number,
    default:true,
  },
  is_deleted: {
    type: Number,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES
//   });
// };

const User = mongoose.model('Users', userSchema);

module.exports = User;
