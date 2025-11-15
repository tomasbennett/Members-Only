import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../services/ensureAuthentication";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";
import { HTTPError } from "../errors/httpErrors";


export const router = Router();


router.get("/", ensureAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const includeUser: boolean = req.user?.member ?? false;

        const allPosts = await prisma.posts.findMany({
            include: { user: includeUser }
        });

        return res.status(200).render("posts", { 
            title: "All Posts",
            posts: allPosts 
        });

    } catch (err) {
        return next(err);

    }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const id: number = Number(req.params.id);
    
    if (isNaN(id)) {
        const err: HTTPError = new HTTPError("Post ID must be a number", 400);
        err.name = "Bad Request";
        return next(err);
    }
    
    if (id !== Math.floor(id)) {
        const err: HTTPError = new HTTPError("Post ID must be an Integer", 400);
        err.name = "Bad Request";
        return next(err);
    }
    
    try {
        console.log("we made it this far");
        const isMember: boolean = req.user?.member ?? false;

        const post = await prisma.posts.findMany({
            where: {
                id: id
            },
            include: {
                user: isMember
            }
        });


        console.log(post);

        return res.status(200).render("posts", { 
            title: "Single Post ID",
            posts: post
        });

    } catch (err) {
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
