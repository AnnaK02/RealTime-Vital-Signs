/********************************************************************/
/*
  Real Time Vital Signs
  Grupo:

*/
/*******************************************************************/


/****************************Bibliotecas****************************/
#include <arduino.h>
/*Biblioteca para Conexão Wi-fi */
#include <WiFi.h>
#include "WifiConfig.h"
/*Biblioteca para Pub e Sub MQTT */
#include <PubSubClient.h>

/*Biblioteca para o Sensor de medição de temperatura com DS18B20 */
#include <OneWire.h>
#include <DallasTemperature.h>

/* Biblioteca para Sensor de medição de BPM e O2 com MAX30100 */
#include "MAX30100_PulseOximeter.h"

/*******************************************************************/


/*************************Define valores**************************/
/*o pino de dados do sensor está ligado na porta 2*/
#define PIN_TEMP 23
/* periodo em ms para reportar dados do sensor de BPM/O2 */
#define REPORTING_PERIOD_MS     1000
/*id conexão MQTT*/
#define ID_MQTT  "RVSigns"
/*tópico para publicação MQTT*/
#define TOPICO_PUBLISH "realtime-vital-signs/measurement/save"
/*******************************************************************/

/*************************Gerencia conexão**************************/
void initWiFi(void);
void initMQTT(void);
void mqtt_callback(char* topic, byte* payload, unsigned int length);
void reconnectMQTT(void);
void reconnectWiFi(void);
void VerificaConexoesWiFIEMQTT(void);
void updTela();
/*******************************************************************/


/********************************WIFI*******************************/
WifiConfig wifi;
const char* ssid        = wifi.network;
const char* PASSWORD    = wifi.password;
WiFiClient espClient;

void reconnectWiFi(void) {
  if (WiFi.status() == WL_CONNECTED)
    return;

  WiFi.begin(ssid, PASSWORD); // Conecta na rede WI-FI

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("Conectado com sucesso na rede ");
  Serial.print(ssid);
  Serial.println("\nIP obtido: ");
  Serial.println(WiFi.localIP());
}

void initWiFi(void) {
  delay(10);
  Serial.println("------Conexao WI-FI------");
  Serial.print("Conectando-se na rede: ");
  Serial.println(ssid);
  Serial.println("Aguarde");

  reconnectWiFi();
}

/*******************************************************************/


/********************************MQTT*******************************/
const char* BROKER_MQTT = "test.mosquitto.org";
int BROKER_PORT = 1883;
PubSubClient MQTT(espClient);

void initMQTT(void) {
  MQTT.setServer(BROKER_MQTT, BROKER_PORT);   //informa qual broker e porta deve ser conectado
  MQTT.setCallback(mqtt_callback);            //atribui função de callback (função chamada quando qualquer informação de um dos tópicos subescritos chega)
}

void mqtt_callback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) {
    char c = (char)payload[i];
    msg += c;
  }

  Serial.print("Chegou a seguinte string via MQTT: ");
  Serial.println(msg);
  Serial.println();
}

void reconnectMQTT(void) {
  while (!MQTT.connected()) {
    Serial.print("* Tentando se conectar ao Broker MQTT: ");
    Serial.println(BROKER_MQTT);

    if (MQTT.connect(ID_MQTT)) {
      Serial.println("Conectado com sucesso ao broker MQTT!");
    } else {
      Serial.println("Falha ao reconectar no broker.");
      Serial.println("Havera nova tentatica de conexao em 2s");
      delay(2000);
    }
  }
}
/*******************************************************************/


/************************Verifica conexões**************************/
void VerificaConexoesWiFIEMQTT(void) {
  if (!MQTT.connected()) {
    reconnectMQTT();
  }
  reconnectWiFi();
}
/*******************************************************************/


/******************************DS18B20******************************/
/*Protocolo OneWire*/
OneWire oneWire(PIN_TEMP);
/*encaminha referências OneWire para o sensor*/
DallasTemperature sensors(&oneWire);
DeviceAddress sensor1;
/*******************************************************************/

/******************************Pulse Oximeter******************************/
int BPM;
float SpO2;
PulseOximeter pox;
uint32_t tsLastReport = 0;
/*******************************************************************/


/*************************Variáveis Globais*************************/
int tempoCicloMedicao = 5;
//int tempoParaNovoCicloHoras = 12;

float medicaoTotalTemp = 0;
int medicaoTotalBatimentos = 0;
float medicaoTotalO2 = 0;

float mediaTemp = 0;
int mediaBatimentos = 0;
float mediaO2 = 0;

/* JSON */
String payload;
char payloadChar[128];
String customer;
String measurements;
/********************************************************************/

void setup() {
  Serial.begin(115200);
  initWiFi();
  initMQTT();

  /* Setup DS18B20 */
  sensors.begin();
  // Localiza e mostra enderecos dos sensores
  Serial.println("Localizando sensores DS18B20...");
  Serial.print("Foram encontrados ");
  Serial.print(sensors.getDeviceCount(), DEC);
  Serial.println(" sensores.");
  if (!sensors.getAddress(sensor1, 0)) 
     Serial.println("Sensores nao encontrados !"); 
  // Mostra o endereco do sensor encontrado no barramento
  Serial.print("Endereco sensor: ");
  //mostra_endereco_sensor(sensor1);
  Serial.println();
  Serial.println();

  /* Setup MAX30100 */
  /* Pulse oximeter setup */
  Serial.print("Initializing pulse oximeter..");
  if (!pox.begin()) {
    Serial.println("FAILED");
    //for (;;);
  } else {
    Serial.println("SUCCESS");
    pox.setOnBeatDetectedCallback(onBeatDetected);

    pox.setIRLedCurrent(MAX30100_LED_CURR_7_6MA);
  }
}

void mostra_endereco_sensor(DeviceAddress deviceAddress)
{
  for (uint8_t i = 0; i < 8; i++)
  {
    // Adiciona zeros se necessário
    if (deviceAddress[i] < 16) Serial.print("0");
    Serial.print(deviceAddress[i], HEX);
  }
}

void onBeatDetected(){
  Serial.println("Beat Detected!");
}

void loop() {
  VerificaConexoesWiFIEMQTT();

  int tempoContador = tempoCicloMedicao;
  medicaoTotalTemp = 0;
  medicaoTotalBatimentos = 0;
  medicaoTotalO2 = 0;

  while (tempoContador > 0) {
    medicaoTotalTemp += buscaDadosTemperatura();
    medicaoTotalBatimentos += buscaDadosBPM();
    medicaoTotalO2 += buscaDadosO2();

    tempoContador--;
    delay(1000);
   }

  mediaTemp = calculaMedia(medicaoTotalTemp);
  mediaBatimentos = calculaMedia(medicaoTotalBatimentos);
  mediaO2 = calculaMedia(mediaO2);
  
  Serial.print("A media é: ");
  Serial.println(mediaTemp);
  Serial.print("A media é: ");
  Serial.println(mediaBatimentos);
  Serial.print("A media é: ");
  Serial.println(mediaO2);

  buildPayload();
  MQTT.publish(TOPICO_PUBLISH, payloadChar);
  
  //delay(horasParaMilesimos(tempoParaNovoCicloHoras));
}


/* Temperatura */
float buscaDadosTemperatura () {
  /* use sensors.requestTemperatures() para o requerimento de temperatura de todos os dispositivos ligados */
  /* Envia o comando para leitura da temperatura */
  sensors.requestTemperatures();
  Serial.print("A temperatura é: ");
  Serial.println(sensors.getTempC(sensor1));
  return sensors.getTempC(sensor1);
}

/* BPM */
int buscaDadosBPM(){
  pox.update();
  BPM = pox.getHeartRate();

  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
  {
    Serial.print("BPM: ");
    Serial.println(BPM);
    Serial.println("*********************************");
    Serial.println();
    tsLastReport = millis();
  }

  return BPM;
}

/* O2 */
float buscaDadosO2(){
  pox.update();
  SpO2 = pox.getSpO2();

  if (millis() - tsLastReport > REPORTING_PERIOD_MS)
  {
    Serial.print("SpO2: ");
    Serial.print(SpO2);
    Serial.println("%");
    Serial.println("*********************************");
    Serial.println();
    tsLastReport = millis();
  }

  return SpO2;
}

int horasParaMilesimos(int horas) {
  return horas * 60 * 60 * 1000;
}

float calculaMedia(float valor) {
  return valor/tempoCicloMedicao;
}


void buildPayload(){
  /* Formato */
  /* 
  '{"customerId": "4e59a711-b3b3-4fbd-849d-804dacb15e43", "measurement": {"bpm": 90, "oxygenation": 130, "temperature": 120}}'
  */
  
  payload = "{\"customerId\": \"4e59a711-b3b3-4fbd-849d-804dacb15e43\",";
  
  measurements = " \"measurement\": {\"bpm\": ";
  measurements += 0; //mediaBatimentos
  measurements += ", \"oxygenation\": ";
  measurements += 0; // mediaO2
  measurements += ", \"temperature\": ";
  measurements += mediaTemp; // mediaTemp
  measurements += "}}";
   
  payload += measurements;
  
  payload.toCharArray(payloadChar, payload.length()+1);

  Serial.println("Payload:");
  Serial.println(payload);
}
