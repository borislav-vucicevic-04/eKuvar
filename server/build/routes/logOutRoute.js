"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logOutRoute = (0, express_1.Router)();
const logOut = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        response.cookie('token', 'token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1
        });
        response.cookie('isAuthorised', 'token', {
            secure: false,
            sameSite: 'lax',
            maxAge: 1
        });
        response.cookie('korisnik', 'token', {
            secure: false,
            sameSite: 'lax',
            maxAge: 1
        });
        response.status(200).json({ success: true });
        return;
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error });
        return;
    }
});
logOutRoute.post('/', logOut);
exports.default = logOutRoute;
