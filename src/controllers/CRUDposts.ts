import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../services/ensureAuthentication";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";
import { HTTPError } from "../errors/httpErrors";
import { usernamepasswordSchema } from "../models/usernamepasswordSchema";


export const router = Router();



router.get("/", ensureAuthentication, (req, res, next) => {

    return res.render("login", {
        title: "Create new post",
        formAction: "/create-post",
        signupUrl: "/posts",
        signupText: "Return to posts...",

        usernameName: "title",
        usernameLabel: "Title",
        usernamePlaceholder: "Please insert the title for your new post here...",

        passwordName: "body",
        passwordLabel: "Body",
        passwordType: "text",
        passwordPlaceholder: "Please insert the body of your new post here..."
    });

});


router.post("/", ensureAuthentication, async (req: Request<{}, {}, { title: string, body: string }>, res, next) => {
    const { title, body } = req.body;

    const titleResult = usernamepasswordSchema.safeParse(title);
    if (!titleResult.success) {
        return res.render("login", {
            error: titleResult.error.issues[0].message,

            title: "Create new post",
            formAction: "/create-post",
            signupUrl: "/posts",
            signupText: "Return to posts...",

            usernameName: "title",
            usernameLabel: "Title",
            usernamePlaceholder: "Please insert the title for your new post here...",

            passwordName: "body",
            passwordLabel: "Body",
            passwordType: "text",
            passwordPlaceholder: "Please insert the body of your new post here..."
        });
    }

    const bodyResult = usernamepasswordSchema.safeParse(body);
    if (!bodyResult.success) {
        return res.render("login", {
            error: bodyResult.error.issues[0].message,

            title: "Create new post",
            formAction: "/create-post",
            signupUrl: "/posts",
            signupText: "Return to posts...",

            usernameName: "title",
            usernameLabel: "Title",
            usernamePlaceholder: "Please insert the title for your new post here...",

            passwordName: "body",
            passwordLabel: "Body",
            passwordType: "text",
            passwordPlaceholder: "Please insert the body of your new post here..."
        });
    }




    const user = req.user!;

    try {
        const post = await prisma.posts.create({
            data: {
                title: title,
                body: body,
                userId: user.id
            }
        });

        return res.redirect("/posts");

    } catch (err: unknown) {
        console.error("Post creation failed:", err);

        return res.status(500).render("login", {
            error: "Unexpected server error...",

            title: "Create new post",
            formAction: "/create-post",
            signupUrl: "/posts",
            signupText: "Return to posts...",

            usernameName: "title",
            usernameLabel: "Title",
            usernamePlaceholder: "Please insert the title for your new post here...",

            passwordName: "body",
            passwordLabel: "Body",
            passwordType: "text",
            passwordPlaceholder: "Please insert the body of your new post here..."

        });

    }

});




router.use(ensureAuthentication, async (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    return res.status(err?.statusCode ?? 500).send(`
        Error Occurred: ${err?.name ?? "Internal server error"}
        ERROR: ${err?.message ?? "Undefined message given"}
        `);

});