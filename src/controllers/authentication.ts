import { NextFunction, Request, Response, Router } from "express";
import { Prisma, Users } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";
import passport from "passport";
import { ensureAuthentication } from "../services/ensureAuthentication";
import { HTTPError } from "../errors/httpErrors";
import { usernamepasswordSchema } from "../models/usernamepasswordSchema";

import bcrypt from "bcrypt";


export const router = Router();


router.get("/login", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).render("login", {
        title: "Log In",
        formAction: "/login",
        signupUrl: "/signup",
        signupText: "Sign In"
    });
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
    
    passport.authenticate("local", (err: Error, user: Users | false, info: { message?: string } | undefined) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.render("login", { error: info?.message || "Login failed" });
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            return res.redirect("/posts");
        });
    });

});


router.get("/logout", ensureAuthentication, (req, res, next) => {
    
    req.logout(function (err) {
        if (err) return next(err);
        res.redirect("/login");
    });

});










router.get("/signup", (req: Request, res: Response, next: NextFunction) => {
    
    return res.status(200).render("login", {
        title: "Sign up",
        formAction: "/signup",
        signupUrl: "/login",
        signupText: "Log In"
    });

});


router.post("/signup", async (req: Request<{}, {}, {
    username: string,
    password: string
}>, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    const usernameResult = usernamepasswordSchema.safeParse(username);
    if (!usernameResult.success) {
        return res.render("login", { error: usernameResult.error.issues[0].message })
    }

    const passwordResult = usernamepasswordSchema.safeParse(password);
    if (!passwordResult.success) {
        return res.render("login", { error: passwordResult.error.issues[0].message })
    }


    try {
        const saltRounds: number = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        const user = await prisma.users.create({
            data: {
                username: username,
                password: hashedPassword,
                member: false
            }
        })

        req.logIn(user, (err) => {
            if (err) return next(err);
            
            return res.redirect("/posts");
        });
    } catch (err: unknown) {

        if (err instanceof Prisma.PrismaClientKnownRequestError) {

            if (err.code === "P2002") {
                return res.status(400).render("signup", {
                    error: "That username is already taken!!!",
                });
            }

            return res.status(400).render("signup", {
                error: `Prisma Error: ${err.code}`,
            });
        }

        if (err instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).render("signup", {
                error: "Invalid data submitted!!!",
            });
        }

        return next(err);
    }





});





router.use(async (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    return res.status(err?.statusCode ?? 500).send(`
        Error Occurred: ${err?.name ?? "Internal server error"}
        ERROR: ${err?.message ?? "Undefined message given"}
        `);

});