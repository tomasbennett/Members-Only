import { Users } from "@prisma/client";
import * as express from "express";


declare global {
    namespace Express {
        interface Request {
            locale: "en" | "sp" | "ar",
            user?: Users
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