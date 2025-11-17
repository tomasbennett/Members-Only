import { Request, Response, NextFunction } from "express";

export function ensureAuthentication(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/login");
}


export function ensureUnauthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect("/posts");
    }
    
    return next();
}