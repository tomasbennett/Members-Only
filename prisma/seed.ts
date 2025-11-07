import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


async function defaultInsert() {
    await prisma.user.deleteMany();

    await prisma.user.createMany({
        data: [
            {
                name: "Pat the gamer",
            },
            {
                name: "default3"
            },
            {
                name: "instant eyes"
            },
            {
                name: "lego"
            },
            {
                name: "Harry"
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