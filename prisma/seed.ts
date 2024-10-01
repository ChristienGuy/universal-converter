import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const objectData: Prisma.ObjectCreateInput[] = [
  {
    name: "Olympic Swimming Pool",
    volume: 2_500_000_000,
  },
  {
    name: "Bumblebee",
    volume: 0.3,
  },
  {
    name: "Baseball",
    volume: 216.505,
  },
  {
    name: "Honda Civic",
    volume: 7989696,
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
