import prisma from "../../database/prisma.service";

export default class CustomerRepository {
  async findAll() {
    const data = await prisma.customer.findMany({
      include: {
        measurements: true
      }
    });

    return data.map((el) => ({
      ...el,
      measurements: el.measurements.map(measurement => ({
        ...measurement,
        value: JSON.parse(measurement.value)
      }))
    }));
  }
}