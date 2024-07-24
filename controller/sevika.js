const  ScreenerModel = require('../model/ScreenerModel');
const  Tokens = require('../model/tokens');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiResponse=require('../helper/apiResponse')
const { setUser } = require('../service/auth');
const { SevikaModel } = require('../model/SevikaModel');
require("dotenv").config();
const DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE;
const ALLOW_MULTIPLE_LOGINS = process.env.ALLOW_MULTIPLE_LOGINS;

async  function handleCreateSevika(req, res) {
    try {
        // Extract screener details from the request body
        const {
            sevikaId,
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
        } = req.body;

        // Check if the screener already exists by mobile number
        const existingScreener = await SevikaModel.findOne({ mobile:mobile });
        if (existingScreener) {
            return apiResponse.ErrorResponse(res, "Sevika already exists with the provided mobile number");
        }

        // Check if the screener already exists by email
        const existingEmail = await SevikaModel.findOne({ email:email });
        if (existingEmail) {
            return apiResponse.ErrorResponse(res, "Sevika already exists with the provided email");
        }
        // let screenerId=getTextBeforeAt(email);
        const sevikaIdExists = await SevikaModel.findOne({ sevikaId:sevikaId });
        if (sevikaIdExists) {
          return apiResponse.ErrorResponse(res, "Sevika already exists with the provided sevika id");
      }

        // Create new screener
        const newScreener = new SevikaModel({
            sevikaId,
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
            is_active: true,
            is_deleted: false,
            createdAt: Date.now()
        });

        // Save screener to the database
        const savedScreener = await newScreener.save();
        return apiResponse.successResponseWithData(res, 'Sevika created successfully', savedScreener);
    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, 'Error occurred during API call');
    }
}

async function handleGetAllSevika(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allDbUsers = await SevikaModel.find({ is_active: 1, is_deleted: 0 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalUsers = await SevikaModel.countDocuments({ is_active: 1, is_deleted: 0 });
  
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
  
      return apiResponse.successResponseWithData(res, "Sevika list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}

async function handleDeleteSevika(req,res)
{
try {

    if(!req.user.roleId==1)
    {
        return apiResponse.unauthorizedResponse(res, "You are not permitted to execute this operation"); 
    }

    const { sevikaId } = req.body;

    // Find the screener by ID
    const sevikaData = await SevikaModel.findOne({sevikaId:sevikaId});

    // Check if the screener is already deleted or inactive
    if (!sevikaData) {
      return apiResponse.ErrorResponse(res, 'Sevika not found');
    }
    if (sevikaData.is_deleted) {
      return apiResponse.ErrorResponse(res, 'Sevika is already deleted');
    }
    if (!sevikaData.is_active) {
      return apiResponse.ErrorResponse(res, 'Sevika is already inactive');
    }

    // Update the screener
    const updatedSevika = await SevikaModel.findOneAndUpdate(
      { sevikaId: sevikaId },
      { $set: { is_deleted: true, is_active: false } },
      { new: true } // To return the updated document
    );

    return apiResponse.successResponseWithData(res, 'Sevika updated successfully', updatedSevika);
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "An error occurred while updating the Sevika");
  }  
}

async function handleUpdateSevika(req, res) {
    try {

        let updatedDocument;
        let updatableFields;

        
        updatableFields = ['firstName', 'lastName', 'sex', 'mobile', 'mobile2', 'age', 'email', 'ngoId', 'parentId', 'isMapped', 'is_active', 'is_deleted'];

        const prevSevika = await SevikaModel.findOne({ sevikaId: req.body.sevikaId });

        if(!prevSevika)
        {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Sevika not found");
        }
        
        // Check if the user is trying to update with a different email
        if (prevSevika.email === req.body.email) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Use different email id to update");
        }
        // Check if the user is trying to update with a different mobile number
        if (prevSevika.mobile === req.body.mobile) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Use different mobile number to update");
        }

        // Check if the email is already in use
        const emailInUse = await SevikaModel.findOne({ email: req.body.email });
        if (emailInUse && emailInUse._id !== req.body.id) {
            return apiResponse.ErrorBadRequestResponseWithData(res, "Email is already in use");
        }

        // Check if the mobile number is already in use
        const mobileInUse = await SevikaModel.findOne({ mobile: req.body.mobile });
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
            updatedDocument = await SevikaModel.findOneAndUpdate(
                { sevikaId: req.body.sevikaId }, // Assuming ngoId is part of the URL params
                { $set: fieldsToBeUpdated },
                { new: true } // To return the updated document
            );
        } else {
            return apiResponse.ErrorBadRequestResponseWithData(res, "No params found for updating the Sevika");
        }

        // Check if the document was updated successfully
        if (!updatedDocument) {
            return apiResponse.ErrorResponse(res, "Error occurred while updating the Sevika");
        }

        return apiResponse.successResponseWithData(res, "Sevika details updated successfully", updatedDocument);

    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error occurred while updating the Sevika details");
    }
}
async function handleGetSevikaById(req, res) {
    try {
        const sevikaId = req.body.sevikaId;
        const sevikaData = await SevikaModel.findOne({ sevikaId: sevikaId });

        if (!sevikaData) {
            return apiResponse.ErrorBadRequest(res, "Sevika not found");
        }

        if (req.user.roleId !== '1') {
            if (!sevikaData.is_active || sevikaData.is_deleted) {
                return apiResponse.ErrorBadRequest(res, "Sevika is not active or has been deleted");
            }
        }

        return apiResponse.successResponseWithData(res, "Sevika data retrieved successfully", sevikaData);
    } catch (error) {
        console.error(error);
        return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
}
async function handleGetMappedSevikaList(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allSevikas = await SevikaModel.find({ is_active: 1, is_deleted: 0,isMapped:1 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalSevikas = await SevikaModel.countDocuments({ is_active: 1, is_deleted: 0,isMapped:1  });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalSevikas / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allSevikas,
        page:page,
        pageSize:pageSize,
        totalItems:totalSevikas,
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
async function handleGetNotMappedSevikaList(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
  
      // Query the database with pagination and filters
      const allSevikas = await SevikaModel.find({ is_active: 1, is_deleted: 0,isMapped:0 })
                                   .skip(skip)
                                   .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalSevikas = await SevikaModel.countDocuments({ is_active: 1, is_deleted: 0,isMapped:0  });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalSevikas / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allSevikas,
        page:page,
        pageSize:pageSize,
        totalItems:totalSevikas,
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
    handleCreateSevika,
    handleGetAllSevika,
    handleDeleteSevika,
    handleUpdateSevika,
    handleGetSevikaById,
    handleGetMappedSevikaList,
    handleGetNotMappedSevikaList
 };