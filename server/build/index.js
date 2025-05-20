"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const app_1 = __importDefault(require("./app"));
app_1.default.listen(config_1.default.APP_PORT, () => {
    console.log(`Hello, application server is running on port ${config_1.default.APP_PORT}.`);
});
