import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function defaultInsert() {
    await prisma.user.deleteMany();

    await prisma.user.createMany({
        data: [
            {
                name: "Pat the gamer",
                email: "a"
            },
            {
                name: "default3",
                email: "b"
            },
            {
                name: "instant eyes",
                email: "c"
            },
            {
                name: "lego",
                email: "d"
            },
            {
                name: "Harry",
                email: "e"
            }
        ]
    });
}


defaultInsert()
    .then(() => {
        console.log("deafult data valid and inserted complete");
    })
    .catch((err) => {
        console.error("somethign went wrong with inserting the default data!!!", err);
    })
    .finally(() => {
        prisma.$disconnect();
    });