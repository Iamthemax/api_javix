const  NgoModel = require('../model/NgoModel');
const  Tokens = require('../model/tokens');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const apiResponse=require('../helper/apiResponse')
const { setUser } = require('../service/auth');
const IssuesModel = require('../model/IssuesModel');
require("dotenv").config();
const DEFAULT_PAGE_SIZE = process.env.DEFAULT_PAGE_SIZE;

async function handleGetAllIssues(req, res) {
    try {
      // Extract page and pageSize from request query parameters, with default values
      const page = parseInt(req.body.page) || 1;
      const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;
      // Query the database with pagination and filters
      const allIssues = await IssuesModel.find({ is_active: 1, is_deleted: 0 })
                                       .skip(skip)
                                       .limit(pageSize);
  
      // Get total number of documents that match the filters
      const totalIssues = await IssuesModel.countDocuments({ is_active: 1, is_deleted: 0 });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(totalIssues / pageSize);
  
      // Construct the response data
      const responseData = {
        data: allIssues,
        page: page,
        pageSize: pageSize,
        totalItems: totalIssues, // Corrected to use totalIssues
        totalPages: totalPages
      };
  
      // Check if the requested page exceeds the total number of pages
      if (page > totalPages) {
        return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages", responseData);
      }
  
      return apiResponse.successResponseWithData(res, "Issue list retrieved successfully", responseData);
    } catch (error) {
      console.log(error);
      return apiResponse.ErrorResponse(res, "Error occurred during API call");
    }
  }
  
async function handleGetIssueById(req, res) {
  try {
    const issueNo = req.body.issueNo;
    const issueData = await IssuesModel.findOne({issueNo:issueNo});
    if(!issueData)
      {
        return apiResponse.ErrorBadRequest(res, "Issue not found", ngoData);
      }
    if(!issueData.is_active==true && issueData.is_deleted==false)
    {
      return apiResponse.ErrorBadRequest(res, "Issue is not active or deleted", issueData);
    }
    return apiResponse.successResponseWithData(res, "Issue data retrived succefully", issueData);
  } catch (error) {
    console.log(error);
    return apiResponse.ErrorResponse(res, "Error occurred during API call");
  }
}
async function handleGetAllIssuesByUserId(req, res) {
    try {
        // Extract page and pageSize from request query parameters, with default values
        const page = parseInt(req.body.page) || 1;
        const pageSize = parseInt(req.body.pageSize) || DEFAULT_PAGE_SIZE;
        // Calculate the number of documents to skip
        const skip = (page - 1) * pageSize;
        // Query the database with pagination and filters
        const allIssues = await IssuesModel.find({ is_active: 1, is_deleted: 0,userId:req.body.userId })
                                         .skip(skip)
                                         .limit(pageSize);
    
        // Get total number of documents that match the filters
        const totalIssues = await IssuesModel.countDocuments({ is_active: 1, is_deleted: 0,userId:req.body.userId});
    
        // Calculate total number of pages
        const totalPages = Math.ceil(totalIssues / pageSize);
    
        // Construct the response data
        const responseData = {
          data: allIssues,
          page: page,
          pageSize: pageSize,
          totalItems: totalIssues, // Corrected to use totalIssues
          totalPages: totalPages
        };
    
        // Check if the requested page exceeds the total number of pages
        if (page > totalPages) {
          return apiResponse.ErrorBadRequestResponseWithData(res, "Requested page exceeds total number of pages", responseData);
        }
        return apiResponse.successResponseWithData(res, "Issue list retrieved successfully", responseData);
      } catch (error) {
        console.log(error);
        return apiResponse.ErrorResponse(res, "Error occurred during API call");
      }
  }

async function handleCreateIssue(req, res) {
    try {
      // Extract issue details from the request body
      const {
          issueTitle,
          issueDetails,
          userId,
          ngoId,
      } = req.body;
      
      // Generate a unique issue number
      const issueNo = generateIssueNo();    
      
      // Create new issue
      const newIssue = new IssuesModel({
          issueNo,
          issueTitle,
          issueDetails,
          userId,
          ngoId,
          createdAt: Date.now(),
          updatedAt: Date.now()
      });
      
      // Save issue to the database
      const savedIssue = await newIssue.save();
      return apiResponse.successResponseWithData(res, 'Issue created successfully', savedIssue);
    } catch (error) {
      console.error(error);
      return apiResponse.ErrorResponse(res, 'Error occurred during API call');
    }
  }
async function handleDeleteIssue(req,res)
{
try {
    const updatedIssue = await IssuesModel.findOneAndUpdate(
    { issueNo: req.body.issueNo,userId:req.body.userId },
    { $set: { is_deleted:true,is_active:false } },
    { new: true } // To return the updated document
  );
  if(!updatedIssue){
    return apiResponse.ErrorResponse(res, "An error occurred while updating the issue");
  }
    return apiResponse.successResponse(res, "Issue deleted successfully");
  } catch (err) {
    console.error(err);
    return apiResponse.ErrorResponse(res, "An error occurred while updating the issue");
  }  
}
async function handleUpdateIssue(req, res) {
    try {
      let updatedDocument;
      let updatableFields;
  
    //   // Define updatable fields based on user's roleId
    //   if (req.user.roleId === 1) {
    //     updatableFields = ['issueTitle', 'issueDetails', 'status', 'comments', 'is_active', 'is_deleted'];
    //   } else {
    //     updatableFields = ['issueDetails', 'comments', 'is_active', 'is_deleted','issueTitle'];
    //   }
      updatableFields = ['issueTitle', 'issueDetails', 'status', 'comments', 'is_active', 'is_deleted'];

      // Filter out only the fields that are allowed to be updated
      const fieldsToBeUpdated = {};
      Object.keys(req.body).forEach(key => {
        if (updatableFields.includes(key)) {
          fieldsToBeUpdated[key] = req.body[key];
        }
      });
  
      // Check if there are fields to update
      if (Object.keys(fieldsToBeUpdated).length > 0) {
        updatedDocument = await IssuesModel.findOneAndUpdate(
          { issueNo: req.body.issueNo }, // Assuming issueNo is part of the request body
          { $set: fieldsToBeUpdated, updatedAt: new Date() }, // Update the updatedAt field
          { new: true } // To return the updated document
        );
      } else {
        return apiResponse.ErrorBadRequestResponseWithData(res, "No params found for updating the issue");
      }
  
      // Check if the document was updated successfully
      if (!updatedDocument) {
        return apiResponse.ErrorResponse(res, "Error occurred while updating the issue");
      }
  
      return apiResponse.successResponseWithData(res, "Issue updated successfully", updatedDocument);
  
    } catch (error) {
      console.error(error);
      return apiResponse.ErrorResponse(res, "Error occurred while updating the issue");
    }
  }

const utility = {
    randomNumber: function (digits) {
        return Math.floor(Math.random() * Math.pow(10, digits)).toString().padStart(digits, '0');
    }
};

function generateIssueNo() {
    var issueNo = "";
    var dateIn = new Date();
    var yyyy = dateIn.getFullYear();
    var mm = (dateIn.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based, pad with leading zero if needed
    var dd = dateIn.getDate().toString().padStart(2, '0'); // pad with leading zero if needed
    var hours = dateIn.getHours().toString().padStart(2, '0'); // pad with leading zero if needed
    var minutes = dateIn.getMinutes().toString().padStart(2, '0'); // pad with leading zero if needed
    var seconds = dateIn.getSeconds().toString().padStart(2, '0'); // pad with leading zero if needed
    var milliseconds = dateIn.getMilliseconds().toString().padStart(3, '0'); // pad with leading zeros if needed
    var yyyymmddhhmmsssss = `${yyyy}${mm}${dd}${hours}${minutes}${seconds}${milliseconds}`;
    issueNo = `${yyyymmddhhmmsssss}${utility.randomNumber(3)}${utility.randomNumber(3)}`;
    console.log(issueNo);
    return issueNo;
}


module.exports = {
  handleCreateIssue,
  handleDeleteIssue,
  handleGetAllIssues,
  handleGetIssueById,
  handleGetAllIssuesByUserId,
  handleUpdateIssue
};
