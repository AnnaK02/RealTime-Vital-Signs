import { PrismaClient } from '@prisma/client';

const data = [
  {
    id: 'efefa1fd-9d0a-4181-896e-de7e914a8baa',
    cnpj: '11111111111111',
    name: 'Pucmed',
    email: 'admin@pucmed.br',
  },
];

export default async (prisma: PrismaClient) => {
  for await (const item of data) {
    await prisma.tenant.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
};