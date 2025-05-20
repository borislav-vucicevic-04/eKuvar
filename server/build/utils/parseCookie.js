"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseCookies = (cookieHeader) => {
    const cookies = {};
    if (!cookieHeader)
        return cookies;
    cookieHeader.split(';').forEach(cookie => {
        const [key, value] = cookie.trim().split('=');
        if (key && value) {
            cookies[key] = decodeURIComponent(value);
        }
    });
    return cookies;
};
exports.default = parseCookies;
