"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const checkAuth_1 = require("../middleware/checkAuth");
const router = express_1.default.Router();
router.get("/login", checkAuth_1.forwardAuthenticated, (req, res) => {
    res.render("login", { messages: req.session.messages });
});
router.post("/login", passport_1.default.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true
}));
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            console.log(err);
    });
    res.redirect("/auth/login");
});
console.log("Registering /github route");
router.get('github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
console.log("Registering /github/callback route");
router.get('github/callback', passport_1.default.authenticate('github', { failureRedirect: '/auth/login' }), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
});
exports.default = router;
