// import "dotenv/config";



// import bcrypt from "bcrypt";

// import { Prisma, PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();


// const defaultUsers: Prisma.UsersCreateInput[] = [
//     {
//         username: 'admin',
//         password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "default_admin_password_123", Number(process.env.SALT_ROUNDS)),
//         member: true,
//         posts: {
//             create: [
//                 {
//                     title: "This is the first post for this site!!!",
//                     body: "This is the message body for the very first post..."
//                 },
//                 {
//                     title: "Second here...",
//                     body: "Just making things up now for speed purposes!!!"
//                 }
//             ]
//         }
//     },
//     {
//         username: 'tb1',
//         password: await bcrypt.hash(process.env.SECOND_USER_PASSWORD || "default_user_password_123", Number(process.env.SALT_ROUNDS)),
//         member: false,
//         posts: {
//             create: [
//                 {
//                     title: "I am a secondary default user",
//                     body: "And this is my message..."
//                 },
//                 {
//                     title: "Random Message here!!!",
//                     body: "Pterodactylane"
//                 }
//             ]
//         }
//     }
// ]



// async function defaultInsert() {
//     // await prisma.user.deleteMany();

//     for (const user of defaultUsers) {
//         await prisma.users.create({
//             data: user
//         });
//     }

// }


// defaultInsert()
//     .then(() => {
//         console.log("deafult data valid and inserted complete");
//     })
//     .catch((err) => {
//         console.error("somethign went wrong with inserting the default data!!!", err);
//     })
//     .finally(() => {
//         prisma.$disconnect();
//     });





import "dotenv/config";
import bcrypt from "bcrypt";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buildDefaultUsers(): Promise<Prisma.UsersCreateInput[]> {
    return [
        {
            username: "admin",
            password: await bcrypt.hash(
                process.env.ADMIN_PASSWORD || "default_admin_password_123",
                Number(process.env.SALT_ROUNDS)
            ),
            member: true,
            posts: {
                create: [
                    {
                        title: "This is the first post for this site!!!",
                        body: "This is the message body for the very first post...",
                    },
                    {
                        title: "Second here...",
                        body: "Just making things up now for speed purposes!!!",
                    },
                ],
            },
        },
        {
            username: "tb1",
            password: await bcrypt.hash(
                process.env.SECOND_USER_PASSWORD || "default_user_password_123",
                Number(process.env.SALT_ROUNDS)
            ),
            member: false,
            posts: {
                create: [
                    {
                        title: "I am a secondary default user",
                        body: "And this is my message...",
                    },
                    {
                        title: "Random Message here!!!",
                        body: "Pterodactylane",
                    },
                ],
            },
        },
    ];
}

async function defaultInsert() {
    const defaultUsers = await buildDefaultUsers();

    for (const user of defaultUsers) {
        await prisma.users.create({ data: user });
    }
}

defaultInsert()
    .then(() => console.log("Default data inserted"))
    .catch((err) => console.error("Error inserting default data:", err))
    .finally(() => prisma.$disconnect());
