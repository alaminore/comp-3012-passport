import { NextFunction, Request, Response } from "express";

/*
FIX ME (types) 😭 - DONE, built in types with Express :)
*/
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
}

/*
FIX ME (types) 😭 - DONE, built in types with Express :)
*/
export const forwardAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
}

// Function to check if they're an admin.
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as {role: string}).role === "admin") {
    return next();
  }
  res.redirect("/auth/login");
}