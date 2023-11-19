import { Server } from 'socket.io';
import MeasurementRepository from "./measurement.repository";

class MeasurementController {
  io: Server | undefined;
  mqtt: boolean = true;

  private measurementRepository: MeasurementRepository;

  constructor() {
    this.measurementRepository = new MeasurementRepository();
  }

  async save(data: any) {
    try {
      if (!data.customerId || !data.measurement) {
        return;
      }

      await this.measurementRepository.save(data);
      this.io?.to(data.customerId).emit('save', data.measurement);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async emit(data: any) {
    try {
      if (!data.customerId || !data.measurement) {
        return;
      }

      this.io?.to(data.customerId).emit('measurement', data.measurement);
    } catch (error: any) {
      console.log(error.message);
    }
  }
}

export default new MeasurementController();