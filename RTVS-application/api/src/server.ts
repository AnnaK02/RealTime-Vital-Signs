import dotenv from 'dotenv';
import cors from 'cors';

import { connect, IPublishPacket, MqttClient } from 'mqtt';
import express, { Application } from "express";
import { Server } from 'socket.io';

import routes from './routes';
import messageConfig from './config/message.config';

dotenv.config();

const app: Application = express();
const port: string | number = process.env.REST_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const server = app.listen(port, () => console.log(`🔥 Server started at port ${port}`));

const io: Server = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  const { room } = socket.handshake.query;
  if (room) socket.join(room);
});

const client: MqttClient = connect(
  process.env.MQTT_HOST || 'mqtt://test.mosquitto.org',
  { clientId: `mqtt_${Math.random().toString(16).substr(2, 8)}` }
);

client.on('connect', () => {
  console.log('🔥 MQTT Client connected');
});

client.subscribe("realtime-vital-signs/#");

client.on("message", (topic: string, data: Buffer, packet: IPublishPacket) => {
  messageConfig(io)(topic, data, packet);
});