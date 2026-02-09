import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
    result: {
        user: {
            name: {
                needs: { first_name: true, last_name: true },
                compute(user) {
                    return `${user.first_name} ${user.last_name}`;
                }
            },
        },
    },
});

export { prisma };
