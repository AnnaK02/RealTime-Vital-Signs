import { OnMessageCallback } from 'mqtt';
import { Server } from 'socket.io';

import MeasurementController from '../modules/measurement/measurement.controller';

const measurementController = MeasurementController;

const messageConfig = (io: Server): OnMessageCallback => (topic: string, data: Buffer) => {
  const [, controllerName, actionName] = topic.split('/');
  const controller = eval(`${controllerName}Controller`);
  
  if (controller && controller.mqtt && controller[actionName]) {
    controller.io = io;
    controller[actionName](JSON.parse(data.toString()));
  }
}

export default messageConfig;
