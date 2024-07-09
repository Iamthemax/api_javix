const mongoose = require('mongoose');
const validator = require('validator');


const ngoSchema = new mongoose.Schema({
    ngoId: {
      type: String,
      required: [true, "Please provide valid Ngo Id"],
      minLength: [3, "Please provide valid Ngo Id"],
      maxLength: [100, "Please provide valid Ngo Id"]
    },
    name: {
      type: String,
      required: [true, "Please provide valid ngo name"],
      minLength: [2, "Ngo name must contain at least 2 characters!"],
      maxLength: [100, "Ngo name cannot exceed 100 characters!"]
    },
    owener: {
      type: String,
      required: [true, "Please provide valid owener name"],
      minLength: [2, "Owener name must contain at least 2 characters!"],
      maxLength: [100, "Owener name cannot exceed 100 characters!"]
    
    },
    mobile: {
      type: String,
      required: [true, "Please provide  valid mobile number"],
      minLength: [10, "Mobile must contain characters "],
      maxLength: [10, "Mobile cannot exceed 10 characters!"],      
    },
    email: {
        type: String,
        required: [true, "Please provide your email "],
        unique: [true, "User already registered with entered email !"],
        validate: [validator.isEmail, "Please provide a valid email!"]
      },
      ngoLoginId: {
        type: String,
        required: [true, "Please provide ngo login id"],
        unique: [true, "ngo login id already registered "]
      },
      javixId: {
        type: String,
        default:''
      },
    ngoRegistrationNo: {type: String, required: true},
	dateOfRegistration: {type: Date, required: true, default:Date.now()},
	dateOfOnBoarding: {type: Date, required: true,default:Date.now()},
	availabilityId: {type: Number, required: true,default:0},
	country: {type: String, required: true},
    state: {type: String, required:true},
    district: {type: String, required:true},
    address: {type: String, required:true},
    photo: {type: String},
    isDefault: {type: Boolean, required: true, default: false},
    rating : {type: Number, required: true, default: 0},
    ngoId: {type: String, required: true},
	image: {type: String, required: false},
	client_logo: {type: String, required: false},
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