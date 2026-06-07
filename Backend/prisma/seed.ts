import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@proinsight.edu';

    const existingAdmin = await prisma.user.findUnique({
        where: { email },
    });

    if (existingAdmin) {
        console.log('Admin already exists');
        return;
    }

    const password = await bcrypt.hash('Admin123', 10);

    await prisma.user.create({
        data: {
            name: 'System Administrator',
            email,
            password,
            role: Role.ADMIN,
        },
    });

    console.log('Admin created successfully');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });