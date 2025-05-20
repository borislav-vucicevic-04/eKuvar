"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generateUserReport_controller_1 = __importDefault(require("../controllers/generateUserReport.controller"));
const userReportRoute = (0, express_1.Router)();
userReportRoute.get('/', generateUserReport_controller_1.default);
exports.default = userReportRoute;
