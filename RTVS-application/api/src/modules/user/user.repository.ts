import prisma from "../../database/prisma.service";

export default class UserRepository {
  async findByCpf(cpf: string) {
    return await prisma.user.findFirstOrThrow({
      where: {
        cpf
      },
    });
  }
}