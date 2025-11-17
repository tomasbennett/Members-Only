import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import { prisma } from "../db/prisma";
import { usernamepasswordSchema } from "../models/usernamepasswordSchema";




passport.serializeUser((user: any, done) => {
    console.log("serialising user:", user);
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {

    try {
        const user = await prisma.users.findFirst({
            where: {
                id: id
            }
        });

        if (user) {
            done(null, user);

        } else {
            done(null, false);

        }


    } catch (err) {
        console.log(err);

    }


});


export default passport.use(
    "local",
    new LocalStrategy(async (username, password, done) => {

        const usernameTrim: string = username.trim();
        const usernameResult = usernamepasswordSchema.safeParse(usernameTrim);
        if (!usernameResult.success) {
            const msg = usernameResult.error.issues[0].message;
            return done(null, false, { message: msg });
        }

        const passwordTrim: string = password.trim();
        const passwordResult = usernamepasswordSchema.safeParse(passwordTrim);
        if (!passwordResult.success) {
            const msg = passwordResult.error.issues[0].message;
            return done(null, false, { message: msg });
        }


        try {
            const user = await prisma.users.findFirst({
                where: {
                    username: usernameTrim
                }
            });

            console.log("user has been found", user);

            if (!user) {
                return done(null, false, {
                    message: "No username found!!!"
                });
            }


            const match = await bcrypt.compare(passwordTrim, user.password);

            if (!match) {
                return done(null, false, {
                    message: "Incorrect password!!!"
                });
            }

            return done(null, user);


        } catch (err) {
            return done(err);

        }




    })
);

