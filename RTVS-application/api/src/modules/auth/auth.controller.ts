import UserRepository from "../user/user.repository";
import { Request, Response } from "express";
import httpResponse from "../../utils/httpResponse";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(req: Request, res: Response) {
    try {
      const { cpf, password } = req.body;

      if (!cpf) {
        return res.status(400).json({ error: 'CPF is required' });
      } else if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const user = await this.userRepository.findByCpf(cpf);

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return httpResponse(res, 'Invalid credentials', 401);
      }

      const token = jwt.sign(
        {
          id: user.id,
          tenantId: user.tenantId,
          cpf: user.cpf,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET || 'secret',
        {
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        }
      );

      return httpResponse(res, { token });
    } catch (error: any) {
      return httpResponse(res, error.message, 500);
    }
  }
}

export default new AuthController();