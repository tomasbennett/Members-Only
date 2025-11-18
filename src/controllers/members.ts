import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../services/ensureAuthentication";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";
import { HTTPError } from "../errors/httpErrors";


export const router = Router();


router.get("/", ensureAuthentication, (req, res, next) => {
    return res.render("login", {
        title: "Members passcode",
        formAction: "/members-only",
        signupUrl: "/posts",
        signupText: "Return to posts...",

        usernameName: "passcode",
        usernameLabel: "Secret Passcode",
        usernamePlaceholder: "Please insert the secret membership passcode here...",

        showSecondPassword: false
    });

});



router.post("/", ensureAuthentication, async (req: Request<{}, {}, { passcode: string }>, res, next) => {
    const { passcode } = req.body;

    const user = req.user!;

    if (passcode === process.env.SECRET_MEMBERSHIP_PASSCODE) {

        try {
            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    member: true
                }
            });
    
            return res.redirect("/posts");

        } catch (err: unknown) {

            if (
                err &&
                typeof err === "object" &&
                "code" in err && 
                err.code === "P2025"
            ) {


                return res.render("login", {
                    error: "Could not find user to update!!!",
            
                    title: "Members passcode",
                    formAction: "/members-only",
                    signupUrl: "/posts",
                    signupText: "Return to posts...",
            
                    usernameName: "passcode",
                    usernameLabel: "Secret Passcode",
                    usernamePlaceholder: "Please insert the secret membership passcode here...",
            
                    showSecondPassword: false
                });

            }

            return next(err);
        }

    }

    return res.render("login", {
        error: "The passcode you typed in wasn't the members passcode, please try again!!!",

        title: "Members passcode",
        formAction: "/members-only",
        signupUrl: "/posts",
        signupText: "Return to posts...",

        usernameName: "passcode",
        usernameLabel: "Membership Secret Passcode",
        usernamePlaceholder: "Please insert the secret membership passcode here...",

        showSecondPassword: false
    });

});




router.use((err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    
    console.error(err);

    return res.status(err?.statusCode ?? 500).send(`
        Error Occurred: ${err?.name ?? "Internal server error"}
        ERROR: ${err?.message ?? "Undefined message given"}
        `);

});