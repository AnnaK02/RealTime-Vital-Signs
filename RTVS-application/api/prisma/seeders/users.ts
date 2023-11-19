import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const data = [
  {
    id: '519d1919-9b21-4056-bfec-4a0252835548',
    tenantId: 'efefa1fd-9d0a-4181-896e-de7e914a8baa',
    cpf:  '11111111111',
    name: 'Fulano',
    email: 'fulano@email.com',
    password: '123456',
  },
];

export default async (prisma: PrismaClient) => {
  for await (const item of data) {
    const password = await bcrypt.hash(item.password, 10);
    await prisma.user.upsert({
      where: { id: item.id },
      update: {
        ...item,
        password,
      },
      create: {
        ...item,
        password,
      },
    });
  }
};