"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyUserIdentity_controller_1 = __importDefault(require("../controllers/verifyUserIdentity.controller"));
const setUserDetails_controller_1 = __importDefault(require("../controllers/setUserDetails.controller"));
const reactivateAccountRoutes = (0, express_1.Router)();
reactivateAccountRoutes.post('/verify-user-identity', verifyUserIdentity_controller_1.default);
reactivateAccountRoutes.post('/set-user-details', setUserDetails_controller_1.default);
exports.default = reactivateAccountRoutes;
