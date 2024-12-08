const express = require("express");
const filterRouter = express.Router();
const { filtercontroller } = require("../controllers/filtercontroller");

// Get tutors by subject
filterRouter.get("/filter", filtercontroller);

module.exports = filterRouter;
