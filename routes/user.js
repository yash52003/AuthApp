const express = require("express");
const router = express.Router();

const {signup} = require("../Controllers/Auth");

// router.post("/login" , login);
router.post("/signup" , signup);

// router.post function is been used for mapping the function {handler} to  the new path
module.exports = router;