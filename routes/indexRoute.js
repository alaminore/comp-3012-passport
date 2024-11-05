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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const checkAuth_1 = require("../middleware/checkAuth");
router.get("/", (req, res) => {
    res.send("welcome");
});
router.get("/dashboard", checkAuth_1.ensureAuthenticated, (req, res) => {
    res.render("dashboard", {
        user: req.user,
    });
});
// This route handles the admin page. They must be authenticated AND be an admin to proceed. Otherwise, you shall not pass! ✋🧙‍♂️
router.get('/admin', checkAuth_1.ensureAuthenticated, checkAuth_1.isAdmin, (req, res) => {
    if (!req.sessionStore || typeof req.sessionStore.all !== 'function') {
        return res.status(500).send("Session store is not configured properly");
    }
    // This maps through the session data available and sends it to the ejs (sessions) for display.
    req.sessionStore.all((err, sessions) => {
        if (err || !sessions) {
            return res.status(500).send("Error retrieving sessions");
        }
        const sessionData = Object.entries(sessions).map(([sessionId, session]) => {
            var _a, _b;
            return ({
                id: sessionId,
                userId: ((_a = session.user) === null || _a === void 0 ? void 0 : _a.id) || 'unknown',
                userName: ((_b = session.user) === null || _b === void 0 ? void 0 : _b.name) || 'unknown',
            });
        });
        res.render('admin', {
            user: req.user,
            sessions: sessionData,
        });
    });
});
// This handles the user revoking sessions, including their own! Oops! 
router.post('/revoke-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sessionId } = req.body;
    try {
        yield new Promise((resolve, reject) => {
            req.sessionStore.destroy(sessionId, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        if (sessionId === req.sessionID) {
            yield new Promise((resolve, reject) => {
                req.logout((err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
            return res.redirect('/auth/login');
        }
        res.redirect('/admin');
    }
    catch (error) {
        console.error("Error revoking session:", error);
        res.status(500).send("Failed to revoke session");
    }
}));
exports.default = router;
