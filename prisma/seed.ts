import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const localStrategy = await prisma.strategy.upsert({
		where: { name: 'local' },
		create: {
			name: 'local',
			enabled: true,
			selfRegistration: false,
		},
		update: {},
	});

	const discordStrategy = await prisma.strategy.upsert({
		where: { name: 'discord' },
		create: {
			name: 'discord',
			enabled: false,
			selfRegistration: false,
		},
		update: {},
	});

	const googleStrategy = await prisma.strategy.upsert({
		where: { name: 'google' },
		create: {
			name: 'google',
			enabled: false,
			selfRegistration: false,
		},
		update: {},
	});

	console.log({ localStrategy, discordStrategy, googleStrategy });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
