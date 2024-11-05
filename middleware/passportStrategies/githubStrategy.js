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
const passport_github2_1 = require("passport-github2");
const userModel_1 = require("../../models/userModel");
if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
    throw new Error("Missing GitHub client ID or secret in environment variables");
}
const githubStrategy = new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
}, 
/* FIX ME 😭 */
(req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let user = userModel_1.database.find((user) => { var _a; return user.email === ((_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value); }); // Check if user exists
        if (!user) { //if they don't, add them.
            user = {
                id: userModel_1.database.length + 1,
                name: profile.displayName || profile.username,
                email: (_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value,
                password: '',
                role: "user", // assume no one on github is an admin
            };
            userModel_1.database.push(user);
        }
        // Pass the user to done
        done(null, user);
    }
    catch (error) {
        // Handle any errors
        done(error, null);
    }
}));
const passportGitHubStrategy = {
    name: 'github',
    strategy: githubStrategy,
};
exports.default = passportGitHubStrategy;
