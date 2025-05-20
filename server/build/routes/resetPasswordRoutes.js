"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyEmail_controller_1 = __importDefault(require("../controllers/verifyEmail.controller"));
const verifyOTP_controller_1 = __importDefault(require("../controllers/verifyOTP.controller"));
const setNewPassword_controller_1 = __importDefault(require("../controllers/setNewPassword.controller"));
const resetPasswordRoutes = (0, express_1.Router)();
resetPasswordRoutes.post('/verify-email', verifyEmail_controller_1.default);
resetPasswordRoutes.post('/verify-otp', verifyOTP_controller_1.default);
resetPasswordRoutes.post('/set-new-password', setNewPassword_controller_1.default);
exports.default = resetPasswordRoutes;
