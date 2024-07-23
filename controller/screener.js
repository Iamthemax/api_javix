const  ScreenerModel = require('../model/ScreenerModel');
const  Tokens = require('../model/tokens');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiResponse=require('../helper/apiResponse')
const { setUser } = require('../service/auth');
require("dotenv").config();
const DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE;
const ALLOW_MULTIPLE_LOGINS = process.env.ALLOW_MULTIPLE_LOGINS;

async  function handleCreateScreener(req, res) {
    try {
        // Extract screener details from the request body
        const {
            firstName,
            lastName,
            sex,
            mobile,
            mobile2,
            age,
            email,
            ngoId,
            parentId,
            isMapped,
            isDeleted,
            isSubScreener,
            dateOfBirth,
            dateOfOnBoarding,
            qualification,
            specialisation,
            country,
            state,
            district,
            address,
            pincode,
            photo,
            rating,
            geolocations,
        } = req.body;

        // Check if the screener already exists by mobile number
        const existingScreener = await ScreenerModel.findOne({ mobile });
        if (existingScreener) {
            return apiResponse.ErrorResponse(res, "Screener already exists with the provided mobile number");
        }

        // Check if the screener already exists by email
        const existingEmail = await ScreenerModel.findOne({ email });
        if (existingEmail) {
            return apiResponse.ErrorResponse(res, "Screener already exists with the provided email");
        }
        let screenerId=getTextBeforeAt(email);
        const screenerIdExists = await ScreenerModel.findOne({ screenerId });
        if (screenerIdExists) {
          return apiResponse.ErrorResponse(res, "Screener already exists with the provided screener id");
      }

        // Create new screener
        const newScreener = new ScreenerModel({
            screenerId,
            firstName,
            lastName,
            sex,
            mobile,
            mobile2,
            age,
            email,
            ngoId,
            parentId,
            isMapped,
            isDeleted,
            isSubScreener,
            dateOfBirth,
            dateOfOnBoarding,
            qualification,
            specialisation,
            country,
            state,
            district,
            address,
            pincode,
            photo,
            rating,
            geolocations,
            is_active: true,
            is_deleted: false,
            createdAt: Date.now()
        });

        // Save screener to the database
        const savedScreener = await newScreener.save();
        return apiResponse.successResponseWithData(res, 'Screener created successfully', savedScreener);
    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, 'Error occurred during API call');
    }
}

async function handleGetAllScreener(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await ScreenerModel.find({ is_active: 1, is_deleted: 0 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await ScreenerModel.countDocuments({ is_active: 1, is_deleted: 0 });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allDbUsers,
        page:page,
        pageSize:pageSize,
        totalItems:totalUsers,
        totalPages:totalPages
      };
      if (page > totalPages) {
        return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages",responseData);
      }
  
      return apiResponse.successResponseWithData(res, "User list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}

async function handleDeleteScreener(req,res)
{
try {

    if(!req.user.roleId==1)
    {
        return apiResponse.unauthorizedResponse(res, "You are not permitted to execute this operation"); 
    }

    const { id } = req.body;

    // Find the screener by ID
    const screener = await ScreenerModel.findById(id);

    // Check if the screener is already deleted or inactive
    if (!screener) {
      return apiResponse.ErrorResponse(res, 'Screener not found');
    }
    if (screener.is_deleted) {
      return apiResponse.ErrorResponse(res, 'Screener is already deleted');
    }
    if (!screener.is_active) {
      return apiResponse.ErrorResponse(res, 'Screener is already inactive');
    }

    // Update the screener
    const updatedScreener = await ScreenerModel.findOneAndUpdate(
      { _id: id },
      { $set: { is_deleted: true, is_active: false } },
      { new: true } // To return the updated document
    );

    return apiResponse.successResponseWithData(res, 'Screener updated successfully', updatedScreener);
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "An error occurred while updating the screener");
  }  
}

async function handleUpdateScreener(req, res) {
    try {

        let updatedDocument;
        let updatableFields;

        // Define updatable fields based on user's roleId
        if (req.user.roleId === '1') {
            updatableFields = ['name', 'owner', 'mobile', 'email', 'ngoLoginId', 'ngoRegistrationNo', 'dateOfRegistration', 'dateOfOnBoarding', 'availabilityId', 'country', 'state', 'district', 'address', 'photo', 'isDefault', 'rating', 'image', 'client_logo', 'is_active', 'is_deleted'];
        } else {
            updatableFields = ['name', 'owner', 'mobile', 'email', 'is_active', 'is_deleted'];
        }

        const prevScrenner = await ScreenerModel.findOne({ _id: req.body.id });

        if(!prevScrenner)
        {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Screener not found");
        }
        
        // Check if the user is trying to update with a different email
        if (prevScrenner.email === req.body.email) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Use different email id to update");
        }
        // Check if the user is trying to update with a different mobile number
        if (prevScrenner.mobile === req.body.mobile) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Use different mobile number to update");
        }

        // Check if the email is already in use
        const emailInUse = await ScreenerModel.findOne({ email: req.body.email });
        if (emailInUse && emailInUse._id !== req.body.id) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Email is already in use");
        }

        // Check if the mobile number is already in use
        const mobileInUse = await ScreenerModel.findOne({ mobile: req.body.mobile });
        if (mobileInUse && mobileInUse._id !== req.body.id) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Mobile number is already in use");
        }

        // Filter out only the fields that are allowed to be updated
        const fieldsToBeUpdated = {};
        Object.keys(req.body).forEach(key => {
            if (updatableFields.includes(key)) {
                fieldsToBeUpdated[key] = req.body[key];
            }
        });

        // Check if there are fields to update
        if (Object.keys(fieldsToBeUpdated).length > 0) {
            updatedDocument = await ScreenerModel.findOneAndUpdate(
                { _id: req.body.id }, // Assuming ngoId is part of the URL params
                { $set: fieldsToBeUpdated },
                { new: true } // To return the updated document
            );
        } else {
            return apiResponse.ErrorBadRequestResponseWithData(res, "No params found for updating the Screener");
        }

        // Check if the document was updated successfully
        if (!updatedDocument) {
            return apiResponse.ErrorResponse(res, "Error occurred while updating the Screener");
        }

        return apiResponse.successResponseWithData(res, "Screener updated successfully", updatedDocument);

    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error occurred while updating the Screener");
    }
}
async function handleGetScreenerById(req, res) {
    try {
        const id = req.body.id;
        const screenerData = await ScreenerModel.findOne({ _id: id });

        if (!screenerData) {
            return apiResponse.ErrorBadRequest(res, "Screener not found");
        }

        if (req.user.roleId !== '1') {
            if (!screenerData.is_active || screenerData.is_deleted) {
                return apiResponse.ErrorBadRequest(res, "Screener is not active or has been deleted");
            }
        }

        return apiResponse.successResponseWithData(res, "Screener data retrieved successfully", screenerData);
    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}
async function handleGetMappedScreenersList(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await ScreenerModel.find({ is_active: 1, is_deleted: 0,isMapped:1 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await ScreenerModel.countDocuments({ is_active: 1, is_deleted: 0,isMapped:1  });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allDbUsers,
        page:page,
        pageSize:pageSize,
        totalItems:totalUsers,
        totalPages:totalPages
      };
      if (page > totalPages) {
        return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages",responseData);
      }
  
      return apiResponse.successResponseWithData(res, "User list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}
async function handleGetNotMappedScreenersList(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await ScreenerModel.find({ is_active: 1, is_deleted: 0,isMapped:0 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await ScreenerModel.countDocuments({ is_active: 1, is_deleted: 0,isMapped:0  });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalUsers / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allDbUsers,
        page:page,
        pageSize:pageSize,
        totalItems:totalUsers,
        totalPages:totalPages
      };
      if (page > totalPages) {
        return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages",responseData);
      }
  
      return apiResponse.successResponseWithData(res, "User list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}
function getTextBeforeAt(email) {
  if (typeof email !== 'string') {
    throw new Error('Input must be a string');
  }
  const atIndex = email.indexOf('@');
  return email.substring(0, atIndex);
}

module.exports = { 
    handleCreateScreener,
    handleGetAllScreener,
    handleDeleteScreener,
    handleUpdateScreener,
    handleGetScreenerById,
    handleGetMappedScreenersList,
    handleGetNotMappedScreenersList
 };