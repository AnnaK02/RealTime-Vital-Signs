import { PrismaClient } from '@prisma/client';

const data = [
  {
    id: '4e59a711-b3b3-4fbd-849d-804dacb15e43',
    tenantId: 'efefa1fd-9d0a-4181-896e-de7e914a8baa',
    cpf:  '11111111111',
    name: 'Ciclano',
    email: 'ciclano@email.com',
    birthday: '2001-01-01',
  },
];

export default async (prisma: PrismaClient) => {
  for await (const item of data) {
    await prisma.customer.upsert({
      where: { id: item.id },
      update: {
        ...item,
        birthday: new Date(item.birthday).toISOString(),
      },
      create: {
        ...item,
        birthday: new Date(item.birthday).toISOString(),
      },
    });
  }
};