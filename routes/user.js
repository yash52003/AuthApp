const express = require("express");
const router = expressRouter();

const {login , signup} = require("../Controllers/Auth");

router.post("/login" , login);
router.post("/signup" , signup);

// router.post function is been used for mapping the function {handler} to  the new path