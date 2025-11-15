import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import { prisma } from "../db/prisma";
import { usernamepasswordSchema } from "../models/usernamepasswordSchema";

export default function configurePassport() {

    passport.use(
        new LocalStrategy(async (username, password, done) => {

            const usernameResult = usernamepasswordSchema.safeParse(username);
            if (!usernameResult.success) {
                const msg = usernameResult.error.issues[0].message;
                return done(null, false, { message: msg });
            }

            const passwordResult = usernamepasswordSchema.safeParse(password);
            if (!passwordResult.success) {
                const msg = passwordResult.error.issues[0].message;
                return done(null, false, { message: msg });
            }


            try {
                const user = await prisma.users.findFirst({
                    where: {
                        username: username
                    }
                });

                if (!user) {
                    return done(null, false, {
                        message: "No username found!!!"
                    });
                }

                const match = await bcrypt.compare(password, user.password);

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

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    // 3. Deserialize user → take id from session and get full user object
    passport.deserializeUser(async (id: number, done) => {
        const user = await prisma.users.findFirst({
            where: {
                id: id
            }
        });

        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }

    });
}
