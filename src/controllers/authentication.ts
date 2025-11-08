import { NextFunction, Request, Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { Posts } from "@prisma/client";

import { prisma } from "../db/prisma";


const router = Router();


router.get("/login", (req: Request, res: Response, next: NextFunction) => {

});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {

});




router.get("/signup", (req: Request, res: Response, next: NextFunction) => {

});


router.post("/signup", (req: Request, res: Response, next: NextFunction) => {

});