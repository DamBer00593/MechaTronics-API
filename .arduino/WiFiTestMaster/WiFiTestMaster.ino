#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPmDNS.h>
#include <EEPROM.h>

#include "masterWebServer.h"
#include "ledController.h"
#include "WiFiConnection.h"

const char* ssid = "HomeAssistantTest";
const char* password = "HomeAssistantTest";
const char* hostName = "Plant-Master";

masterWebServer server(80);
ledController led(2, 200);
WiFiConnection wifi(deviceID, led, server);
void setup(){
   wifi.setup();
   Serial.println(deviceID); 
   while (wifi.getStatus() != WL_CONNECTED){
    
  }
}

void loop(){
  led.loop();
  wifi.loop();
}