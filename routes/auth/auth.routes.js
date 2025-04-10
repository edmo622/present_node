const express = require("express")
const auth_routes = express.Router("")
const auth_controller = require("../../controllers/auth/auth_controller")

auth_routes.post("/login", auth_controller.login)

module.exports = auth_routes
