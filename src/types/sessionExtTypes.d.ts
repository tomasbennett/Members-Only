import * as express from "express";


declare global {
    namespace Express {
        interface Request {
            locale: "en" | "sp" | "ar"
        }
    }
}


import * as session from "express-session";

declare module "express-session" {
    interface SessionData {
        counter?: number;
        lastSet?: string;
    }
}