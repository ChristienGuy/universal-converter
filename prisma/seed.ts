import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const objectData: Prisma.ObjectCreateInput[] = [
  {
    name: "Olympic Swimming Pool",
    volume: 500_000,
  },
  {
    name: "Bumblebee",
    volume: 2,
  },
];

async function main() {
  console.log("Start seeding ...");

  for (const object of objectData) {
    const newObject = await prisma.object.create({
      data: object,
    });
    console.log(`Created object with id: ${newObject.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
