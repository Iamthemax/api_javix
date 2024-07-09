const  NgoModel = require('../model/NgoModel');
const  Tokens = require('../model/tokens');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiResponse=require('../helper/apiResponse')
const { setUser } = require('../service/auth');
require("dotenv").config();
const DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE;
const ALLOW_MULTIPLE_LOGINS = process.env.ALLOW_MULTIPLE_LOGINS;

  async function handleGetAllNgos(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await NgoModel.find({ is_active: 1, is_deleted: 0 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await NgoModel.countDocuments({ is_active: 1, is_deleted: 0 });
  
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

async function handleCreateNgo(req, res) {
  try {
    // Extract user details from the request body
    const {
        ngoId,
        name,
        owner,
        mobile,
        email,
        ngoLoginId,
        ngoRegistrationNo,
        dateOfRegistration,
        dateOfOnBoarding,
        availabilityId,
        country,
        state,
        district,
        address,
        photo,
        isDefault,
        rating,
        image,
        client_logo
      } = req.body;
      const existingNgo = await NgoModel.findOne({ ngoId:ngoId });
      if (existingNgo) {
        return apiResponse.ErrorResponse(res, "NGO already exists with the provided NGO ID");
      }
      // Check if the NGO already exists by email
      const existingEmail = await NgoModel.findOne({ email });
      if (existingEmail) {
        return apiResponse.ErrorResponse(res, "NGO already exists with the provided email");
      }
      // Create new NGO
      const newNgo = new NgoModel({
        ngoId,
        name,
        owner,
        mobile,
        email,
        ngoLoginId,
        ngoRegistrationNo,
        dateOfRegistration,
        dateOfOnBoarding,
        availabilityId,
        country,
        state,
        district,
        address,
        photo,
        isDefault,
        rating,
        image,
        client_logo,
        is_active: 1,
        is_deleted: 0,
        createdAt: Date.now()
      });
      // Save NGO to the database
      const savedNgo = await newNgo.save();
      return apiResponse.successResponseWithData(res, 'NGO created successfully', savedNgo);
    } catch (error) {
      console.error(error);
      return apiResponse.ErrorResponse(res, 'Error occurred during API call');
    }
}
async function handleDeleteNgo(req,res)
{
try {

    if(!req.user.roleId==1)
    {
        return apiResponse.unauthorizedResponse(res, "You are not permitted to execute this operation"); 
    }

  const updatedNgo = await NgoModel.findOneAndUpdate(
    { ngoId: req.body.ngoId },
    { $set: { is_deleted:true,is_active:false } },
    { new: true } // To return the updated document
  );
  if(!updatedNgo){
    return apiResponse.ErrorResponse(res, "An error occurred while updating the ngo");
  }
    return apiResponse.successResponse(res, "ngo deleted successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "An error occurred while updating the user");
  }  
}
async function handleUpdateNgo(req,res)
{
    try {
        let updatedDocument;
        let updatableFields;
        
        // Define updatable fields based on user's roleId
        if (req.user.roleId === 1) {
          updatableFields = ['name', 'owner', 'mobile', 'email', 'ngoLoginId', 'ngoRegistrationNo', 'dateOfRegistration', 'dateOfOnBoarding', 'availabilityId', 'country', 'state', 'district', 'address', 'photo', 'isDefault', 'rating', 'image', 'client_logo', 'is_active', 'is_deleted'];
        } else {
          updatableFields = ['name', 'owner', 'mobile', 'email', 'is_active', 'is_deleted'];
        }
        
        // Check if the user is trying to update with a different email
        if (req.user.email === req.body.email) {
          return apiResponse.ErrorBadRequestResponseWithData(res, "Use different email id to update");
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
          updatedDocument = await NgoModel.findOneAndUpdate(
            { ngoId: req.params.ngoId }, // Assuming ngoId is part of the URL params
            { $set: fieldsToBeUpdated },
            { new: true } // To return the updated document
          );
        } else {
          return apiResponse.ErrorBadRequestResponseWithData(res, "No params found for updating the NGO");
        }
        
        // Check if the document was updated successfully
        if (!updatedDocument) {
          return apiResponse.ErrorResponse(res, "Error occurred while updating the NGO");
        }
        
        return apiResponse.successResponse(res, "NGO updated successfully", updatedDocument);
        
      } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error occurred while updating the NGO");
      }
}


module.exports = {
  handleGetAllNgos,
  handleCreateNgo,
  handleDeleteNgo,
  handleUpdateNgo
};
