import { NextFunction, Request, Response, Router } from "express";
import { Prisma, Users } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";
import passport from "passport";
import { ensureAuthentication, ensureUnauthenticated } from "../services/ensureAuthentication";
import { HTTPError } from "../errors/httpErrors";
import { usernamepasswordSchema } from "../models/usernamepasswordSchema";

import bcrypt from "bcrypt";

import "dotenv/config";


export const router = Router();


router.get("/login", ensureUnauthenticated, (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("login", {
        title: "Log In",
        formAction: "/login",
        signupUrl: "/signup",
        signupText: "Sign In"
    });
});

router.post("/login", ensureUnauthenticated, (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", (err: Error, user: Users | false, info: { message?: string } | undefined) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.render("login", {
                error: info?.message || "Login failed",
                title: "Log In",
                formAction: "/login",
                signupUrl: "/signup",
                signupText: "Sign In"
            });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            return res.redirect("/posts");
        });
    })(req, res, next);

});


router.get("/logout", ensureAuthentication, (req, res, next) => {
    console.log("logout page reached:::", req.user);

    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/login");
    });

});










router.get("/signup", ensureUnauthenticated, (req: Request, res: Response, next: NextFunction) => {

    return res.status(200).render("login", {
        title: "Sign up",
        formAction: "/signup",
        signupUrl: "/login",
        signupText: "Log In"
    });

});


router.post("/signup", ensureUnauthenticated, async (req: Request<{}, {}, {
    username: string,
    password: string
}>, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const usernameResult = usernamepasswordSchema.safeParse(username);
    if (!usernameResult.success) {
        return res.render("login", {
            error: usernameResult.error.issues[0].message,
            title: "Sign up",
            formAction: "/signup",
            signupUrl: "/login",
            signupText: "Log In"
        });
    }

    const passwordResult = usernamepasswordSchema.safeParse(password);
    if (!passwordResult.success) {
        return res.render("login", {
            error: passwordResult.error.issues[0].message,
            title: "Sign up",
            formAction: "/signup",
            signupUrl: "/login",
            signupText: "Log In"
        });
    }


    try {
        const hashedPassword: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const user = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                member: false,
                plainTextPassword: password
            }
        });

        req.logIn(user, (err) => {
            if (err) return next(err);

            return res.redirect("/posts");
        });
    } catch (err: unknown) {

        if (err instanceof Prisma.PrismaClientKnownRequestError) {

            if (err.code === "P2002") {
                return res.status(400).render("login", {
                    error: "That username is already taken!!!",
                    title: "Sign up",
                    formAction: "/signup",
                    signupUrl: "/login",
                    signupText: "Log In"
                });
            }

            return res.status(400).render("login", {
                error: `Prisma Error: ${err.code}`,
                title: "Sign up",
                formAction: "/signup",
                signupUrl: "/login",
                signupText: "Log In"
            });
        }

        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).render("login", {
                error: "Invalid data submitted!!!",
                title: "Sign up",
                formAction: "/signup",
                signupUrl: "/login",
                signupText: "Log In"
            });
        }

        return next(err);
    }
});





router.use((err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    
    console.error(err);

    return res.status(err?.statusCode ?? 500).send(`
        Error Occurred: ${err?.name ?? "Internal server error"}
        ERROR: ${err?.message ?? "Undefined message given"}
        `);

});