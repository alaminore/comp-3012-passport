"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const userController_1 = require("../../controllers/userController");
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => {
    const user = (0, userController_1.getUserByEmailIdAndPassword)(email, password);
    if (!user) {
        return done(null, false, { message: "User not found. Please register." });
    }
    if (!(0, userController_1.isUserValid)(user, password)) {
        return done(null, false, { message: "Your login details are not valid. Please try again." });
    }
    return done(null, user);
});
/*
FIX ME (types) DONE 😭
*/
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
/*
FIX ME (types) DONE 😭
*/
passport_1.default.deserializeUser(function (id, done) {
    const user = (0, userController_1.getUserById)(id);
    if (user) {
        done(null, user);
    }
    else {
        done(new Error("User not found"), null);
    }
});
const passportLocalStrategy = {
    name: 'local',
    strategy: localStrategy,
};
exports.default = passportLocalStrategy;
