import prisma from "../../database/prisma.service";

export default class MeansurementRepository {
  async save(data: any) {
    const customer = await prisma.customer.findFirstOrThrow({
      where: {
        id: data.customerId,
      },
    });

    await prisma.measurement.create({
      data: {
        tenantId: customer.tenantId,
        customerId: data.customerId,
        value: JSON.stringify(data.measurement),
      },
    });
  }
}