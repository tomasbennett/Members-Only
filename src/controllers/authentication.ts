import { NextFunction, Request, Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";


export const router = Router();


router.get("/login", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("login", {
        title: "Log In Page",
        formAction: "/login",
        signupUrl: "/signup",
        signupText: "Sign In"
    });
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {

});




router.get("/signup", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("login", {
        title: "Sign up Page",
        formAction: "/signup",
        signupUrl: "/login",
        signupText: "Log In"
    });
});


router.post("/signup", (req: Request, res: Response, next: NextFunction) => {

});