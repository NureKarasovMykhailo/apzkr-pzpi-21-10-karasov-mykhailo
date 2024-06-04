#include <WiFi.h>
#include <HTTPClient.h>
#include "DHTesp.h"

#define BUTTON_PIN 12
#define DHT_PIN 15
#define PULSE_PIN 35

const char* ssid = "Wokwi-GUEST";
const char* password = "";

const char* serverUrl = "http://host.wokwi.internal:5000/api/scanner-history/";

DHTesp dhtSensor;

unsigned long last_button_press = 0;
bool isMeasuring = false;
bool isButtonPressed = false;
float temperature = 0.0;
int pulse = 0;
unsigned long activeWorkedTime = 0;
int scannerId = 34;

void setup() {
  Serial.begin(115200);
  Serial.println("Esp 32 work start");

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop () {
  if (digitalRead(BUTTON_PIN) == LOW && !isMeasuring && !isButtonPressed) {
    delay(10); 
    startMeasurement();
    delay(20);
  } else if (digitalRead(BUTTON_PIN) == HIGH && isMeasuring && !isButtonPressed) {
      isButtonPressed = true;
      delay(10);
  } else if (digitalRead(BUTTON_PIN) == LOW && isMeasuring && isButtonPressed) {
    delay(10); 
    stopMeasurement();
  }
}

void startMeasurement() {
  isMeasuring = true;
  last_button_press = millis();
  Serial.println("Time measurement started");
}

void stopMeasurement() {
  isMeasuring = false;
  activeWorkedTime = (millis() - last_button_press) / 100;
  Serial.print("Time: ");
  Serial.println(activeWorkedTime);
  measureTemp();
  measurePulse();
  sendDataToServer();
}

void measureTemp() {
  TempAndHumidity data = dhtSensor.getTempAndHumidity();
  temperature = data.temperature;
  Serial.print("Temperature: ");
  Serial.print(temperature, 1);
  Serial.println("°C");
}

void measurePulse() {
   int pulseValue = analogRead(PULSE_PIN);
  float voltage = pulseValue * (5.0 / 4095.0);
  int heartRate = (voltage / 3.3) * 675;
  pulse = heartRate;
  Serial.print("Heart rate: ");
  Serial.println(heartRate);
}

void sendDataToServer() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{";
    jsonPayload += "\"temperature\": " + String(temperature) + ",";
    jsonPayload += "\"pulse\": " + String(pulse) + ",";
    jsonPayload += "\"activeWorkedTime\": " + String(activeWorkedTime) + ",";
    jsonPayload += "\"scannerId\": " + String(scannerId);
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("HTTP Response code: " + String(httpResponseCode));
      Serial.println("Response: " + response);
    } else {
      Serial.println("Error on sending POST: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}