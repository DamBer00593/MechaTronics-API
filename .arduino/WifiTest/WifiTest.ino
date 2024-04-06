#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPmDNS.h>
#include <EEPROM.h>
#include "slaveWebServer.h"
#include "ledController.h"
#include "WiFiConnection.h"


const char* ssid = "HomeAssistantTest";
const char* password = "HomeAssistantTest";

slaveWebServer server(80);
ledController led(2, 200);

int deviceID = EEPROM.read(0);
WiFiConnection wifi(deviceID, led, server);
void setup(){
  wifi.setup();
  Serial.println(deviceID);
  while (wifi.getStatus() != WL_CONNECTED){
    
  }
  //ESP.restart();
}

void loop(){
  led.loop();
  wifi.loop();
}
