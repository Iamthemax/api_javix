const mongoose = require('mongoose');
const validator = require('validator');


const ngoSchema = new mongoose.Schema({
    ngoId: {
        type: String,
        required: [true, "Please provide valid Ngo Id"],
        minLength: [1, "Please provide valid Ngo Id"],
        unique: [true, "Ngo Id already exists"],
        maxLength: [100, "Please provide valid Ngo Id"]
    },
    name: {
        type: String,
        required: [true, "Please provide valid ngo name"],
        minLength: [2, "Ngo name must contain at least 2 characters!"],
        maxLength: [100, "Ngo name cannot exceed 100 characters!"]
    },
    owner: {
        type: String,
        required: [true, "Please provide valid owener name"],
        minLength: [1, "Owener name must contain at least 2 characters!"],
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
        required: [true, "Please provide NGO login ID"],
        unique: [true, "NGO login ID already registered"],
        minLength: [1, "NGO login ID must not be empty"],
        maxLength: [100, "Ngo login ID cannot exceed 100 characters!"],
      },
      ngoRegistrationNo: {
        type: String,
        required: [true, "Please provide NGO registration number"],
        minLength: [1, "NGO registration number must not be empty"],
        maxLength: [100, "NGO registration number can not exceed 100 characters!"],
      },
      dateOfRegistration: {
        type: Date,
        required: [true, "Please provide the date of registration"],
        default: Date.now
      },
      dateOfOnBoarding: {
        type: Date,
        required: [true, "Please provide the date of onboarding"],
        default: Date.now
      },
      availabilityId: {
        type: Number,
        required: [true, "Please provide the availability ID"],
        default: 0
      },
      country: {
        type: String,
        required: [true, "Please provide the country"],
        minLength: [1, "Country name must not be empty"],
        maxLength: [100, "Country name can not exceed 100 characters!"],
      },
      state: {
        type: String,
        required: [true, "Please provide the state"],
        minLength: [1, "state name must not be empty"],
        maxLength: [100, "state name can not exceed 100 characters!"],
      },
      district: {
        type: String,
        required: [true, "Please provide the district"],
        minLength: [1, "district name must not be empty"],
        maxLength: [100, "district name can not exceed 100 characters!"],
      },
      address: {
        type: String,
        required: [true, "Please provide the address"],
        minLength: [1, "address must not be empty"],     
     },
      photo: {
        type: String,
        required: [true, "Please provide the photo"],
        minLength: [1, "photo must not be empty"],   
      },
      isDefault: {
        type: Boolean,
        required: [true, "Please specify if this is the default entry"],
        default: false
      },
      rating: {
        type: Number,
        required: [true, "Please provide a rating"],
        default: 0
      },
      ngoId: {
        type: String,
        required: [true, "Please provide the NGO ID"],
        minLength: [1, "NGO ID must not be empty"],
        unique: [true, "NGO ID already registered"],      },
      image: {
        type: String,
        required: [true, "Please provide the image"],
        minLength: [1, "Image is required "],   
      },
    client_logo: {
        type: String,
        required: false
    },
    is_active: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const NgoModel = mongoose.model('Ngos', ngoSchema);

module.exports = NgoModel;
