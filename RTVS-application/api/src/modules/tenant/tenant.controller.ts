import TenantRepository from "./tenant.repository";
import { Request, Response } from "express";
import httpResponse from "../../utils/httpResponse";

class TenantController {
  private tenantRepository: TenantRepository;

  constructor() {
    this.tenantRepository = new TenantRepository();
  }

  async findAll(_: Request, res: Response) {
    try {
      const data = await this.tenantRepository.findAll();
      return httpResponse(res, data);
    } catch (error: any) {
      return httpResponse(res, error.message, 500);
    }
  }
}

export default new TenantController();