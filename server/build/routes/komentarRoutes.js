"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insertKomentar_controller_1 = __importDefault(require("../controllers/insertKomentar.controller"));
const deleteKomentar_controller_1 = __importDefault(require("../controllers/deleteKomentar.controller"));
const komentarRoutes = (0, express_1.Router)();
komentarRoutes.post('/insert', insertKomentar_controller_1.default);
komentarRoutes.post('/delete', deleteKomentar_controller_1.default);
exports.default = komentarRoutes;
