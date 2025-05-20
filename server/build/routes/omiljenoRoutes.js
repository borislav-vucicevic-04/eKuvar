"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insertOmiljeno_controller_1 = __importDefault(require("../controllers/insertOmiljeno.controller"));
const deleteOmiljeno_controller_1 = __importDefault(require("../controllers/deleteOmiljeno.controller"));
const omiljenoRoutes = (0, express_1.Router)();
omiljenoRoutes.post('/insert', insertOmiljeno_controller_1.default);
omiljenoRoutes.post('/delete', deleteOmiljeno_controller_1.default);
exports.default = omiljenoRoutes;
