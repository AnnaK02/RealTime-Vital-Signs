import CustomerRepository from "./customer.repository";
import { Request, Response } from "express";
import httpResponse from "../../utils/httpResponse";

class CustomerController {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async findAll(_: Request, res: Response) {
    try {
      const data = await this.customerRepository.findAll();
      return httpResponse(res, data);
    } catch (error: any) {
      return httpResponse(res, error.message, 500);
    }
  }
}

export default new CustomerController();