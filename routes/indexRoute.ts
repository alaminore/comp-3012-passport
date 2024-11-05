import express from "express";
const router = express.Router();
import { ensureAuthenticated, isAdmin } from "../middleware/checkAuth";


router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});


// This route handles the admin page. They must be authenticated AND be an admin to proceed. Otherwise, you shall not pass! ✋🧙‍♂️
router.get('/admin', ensureAuthenticated, isAdmin, (req, res) => {
  if (!req.sessionStore || typeof req.sessionStore.all !== 'function') {
    return res.status(500).send("Session store is not configured properly");
  }

  // This maps through the session data available and sends it to the ejs (sessions) for display.
  req.sessionStore.all((err, sessions) => {
    if (err || !sessions) {
      return res.status(500).send("Error retrieving sessions");
    }

    const sessionData = Object.entries(sessions).map(([sessionId, session]) => ({
      id: sessionId,
      userId: (session as any).user?.id || 'unknown',
      userName: (session as any).user?.name || 'unknown',
    }));

    res.render('admin', {
      user: req.user,
      sessions: sessionData,
    });
  });
});

// This handles the user revoking sessions, including their own! Oops! 
router.post('/revoke-session', async (req, res) => {
  const { sessionId } = req.body;

  try {
    await new Promise<void>((resolve, reject) => {
      req.sessionStore.destroy(sessionId, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (sessionId === req.sessionID) {
      await new Promise<void>((resolve, reject) => {
        req.logout((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      return res.redirect('/auth/login');
    }

    res.redirect('/admin');
  } catch (error) {
    console.error("Error revoking session:", error);
    res.status(500).send("Failed to revoke session");
  }
});


export default router;
