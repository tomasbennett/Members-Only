import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "./CRUDposts";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";


const router = Router();


router.get("/posts", ensureAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const includeUser: boolean = req.user?.member ?? false;

        const allPosts = await prisma.posts.findMany({
            include: { user: includeUser }
        });


        return res.status(200).json({
            status: 200,
            posts: allPosts.map((post, indx) => {
                return {
                    ...post,
                    user: post?.user ?? "Anonymous"
                }
            })
        });




    } catch (err) {
        next(err);

    }
});


router.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    return res.send(`
        Error Occurred: ${err.name}
        ERROR: ${err.message}
        `);

});
