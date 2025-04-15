import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Utility function to hash passwords
async function hashPassword(password: string | Buffer<ArrayBufferLike>) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function seed() {
  console.log('🌱 Seeding database with extra data...');

  // Optional: Clear existing data for a clean slate.
  // Uncomment the following lines if you want to start fresh:
  // await prisma.block.deleteMany();
  // await prisma.message.deleteMany();
  // await prisma.chatThread.deleteMany();
  // await prisma.user.deleteMany();

  // Users data with additional users
  const usersData = [
    {
      name: 'Alice',
      email: 'alice@example.com',
      password: await hashPassword('alicepassword'),
    },
    {
      name: 'Bob',
      email: 'bob@example.com',
      password: await hashPassword('bobpassword'),
    },
    {
      name: 'Charlie',
      email: 'charlie@example.com',
      password: await hashPassword('charliepassword'),
    },
    {
      name: 'David',
      email: 'david@example.com',
      password: await hashPassword('davidpassword'),
    },
    {
      name: 'Eve',
      email: 'eve@example.com',
      password: await hashPassword('evepassword'),
    },
  ];

  // Upsert users so we avoid duplicate entries on subsequent runs
  const [alice, bob, charlie, david, eve] = await Promise.all(
    usersData.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      })
    )
  );

  // Create a one-on-one chat thread between Alice and Bob
  const chatThreadAB = await prisma.chatThread.create({
    data: {
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }],
      },
    },
  });

  // Create a group chat thread among Alice, Bob, and Charlie
  const groupChat = await prisma.chatThread.create({
    data: {
      participants: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: charlie.id }],
      },
    },
  });

  // Create a one-on-one chat thread between David and Eve
  const chatThreadDE = await prisma.chatThread.create({
    data: {
      participants: {
        connect: [{ id: david.id }, { id: eve.id }],
      },
    },
  });

  // Insert messages into the one-on-one chat (Alice & Bob)
  const msgAB1 = await prisma.message.create({
    data: {
      text: 'Hey Bob, how are you?',
      senderId: alice.id,
      chatId: chatThreadAB.id,
    },
  });

  const msgAB2 = await prisma.message.create({
    data: {
      text: 'Hi Alice! I am doing great. How about you?',
      senderId: bob.id,
      chatId: chatThreadAB.id,
    },
  });

  // Message using citedMsgId example in AB chat
  const msgAB3 = await prisma.message.create({
    data: {
      text: 'I’m good too! Let’s catch up later.',
      senderId: alice.id,
      chatId: chatThreadAB.id,
      citedMsgId: msgAB2.id,
    },
  });

  // Insert messages into the group chat (Alice, Bob, Charlie)
  const msgGroup1 = await prisma.message.create({
    data: {
      text: 'Hello everyone!',
      senderId: charlie.id,
      chatId: groupChat.id,
    },
  });

  const msgGroup2 = await prisma.message.create({
    data: {
      text: 'Hi Charlie, how is it going?',
      senderId: alice.id,
      chatId: groupChat.id,
    },
  });

  const msgGroup3 = await prisma.message.create({
    data: {
      text: 'All good here. Ready for the meeting?',
      senderId: bob.id,
      chatId: groupChat.id,
      citedMsgId: msgGroup1.id,
    },
  });

  const msgGroup4 = await prisma.message.create({
    data: {
      text: 'Yes, let’s get started.',
      senderId: charlie.id,
      chatId: groupChat.id,
      editedAt: new Date(),
    },
  });

  // Insert messages into the David & Eve chat
  const msgDE1 = await prisma.message.create({
    data: {
      text: 'Hey Eve, did you see the news today?',
      senderId: david.id,
      chatId: chatThreadDE.id,
    },
  });

  const msgDE2 = await prisma.message.create({
    data: {
      text: 'Hi David, yes I did. It was really surprising!',
      senderId: eve.id,
      chatId: chatThreadDE.id,
    },
  });

  // Add block relationships:
  // Existing: Charlie blocks Alice.
  await prisma.block.upsert({
    where: { id: 'block-charlie-alice' },
    update: {},
    create: {
      id: 'block-charlie-alice',
      blockerId: charlie.id,
      blockedId: alice.id,
    },
  });

  // New: Bob blocks David.
  await prisma.block.upsert({
    where: { id: 'block-bob-david' },
    update: {},
    create: {
      id: 'block-bob-david',
      blockerId: bob.id,
      blockedId: david.id,
    },
  });

  console.log('✅ Seeding complete with additional data.');
}

async function main() {
  try {
    await seed();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
