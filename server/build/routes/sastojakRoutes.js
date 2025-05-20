"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const getAllSastojci_controller_1 = __importDefault(require("../controllers/getAllSastojci.controller"));
const insertSastojak_controller_1 = __importDefault(require("../controllers/insertSastojak.controller"));
const sastojakRoutes = (0, express_1.Router)();
sastojakRoutes.get('/', getAllSastojci_controller_1.default);
sastojakRoutes.post('/', insertSastojak_controller_1.default);
exports.default = sastojakRoutes;
