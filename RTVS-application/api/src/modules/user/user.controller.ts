import UserRepository from "./user.repository";
import { Request, Response } from "express";
import httpResponse from "../../utils/httpResponse";

interface RequestWithUser extends Request {
  user?: any;
}

class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async me(req: RequestWithUser, res: Response) {
    try {
      const { cpf } = req.user;
      const { password, ...data } = await this.userRepository.findByCpf(cpf);
      return httpResponse(res, data);
    } catch (error: any) {
      return httpResponse(res, error.message, 500);
    }
  }
}

export default new UserController();