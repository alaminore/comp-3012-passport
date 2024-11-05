"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.forwardAuthenticated = exports.ensureAuthenticated = void 0;
/*
FIX ME (types) 😭 - DONE, built in types with Express :)
*/
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
};
exports.ensureAuthenticated = ensureAuthenticated;
/*
FIX ME (types) 😭 - DONE, built in types with Express :)
*/
const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/dashboard");
};
exports.forwardAuthenticated = forwardAuthenticated;
// Function to check if they're an admin.
const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }
    res.redirect("/auth/login");
};
exports.isAdmin = isAdmin;
