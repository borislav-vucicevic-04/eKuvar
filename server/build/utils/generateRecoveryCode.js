"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789#@$=".split('');
const getRandomNumber = (max) => Math.floor(Math.random() * max);
const generateRecoveryCode = (seed) => {
    let code = [];
    let MAX_LENGTH = 16;
    if (seed) {
        code = seed.split('');
        MAX_LENGTH -= seed.length;
    }
    for (let i = 0; i < MAX_LENGTH; i++) {
        const index = getRandomNumber(CHARACTERS.length);
        code.push(CHARACTERS[index]);
    }
    return code.join('');
};
exports.default = generateRecoveryCode;
