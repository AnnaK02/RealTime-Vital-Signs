import prisma from "../../database/prisma.service";

export default class MeansurementRepository {
  async findAll() {
    return await prisma.tenant.findMany();
  }
}