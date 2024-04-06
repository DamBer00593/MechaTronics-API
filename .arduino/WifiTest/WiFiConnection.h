class WiFiConnection{
  public:
    WiFiConnection(int deviceID, ledController led, slaveWebServer server) : deviceID(deviceID), led(led), server(server) {}
    void setup(){
      led.setup();
      led.doBlink(true);
      const char* newDeviceName = "Plant-Slave" + deviceID;
      Serial.println(deviceID);
      if (deviceID == 0){
        WiFi.setHostname(needAdopt);
        
      } else {
        WiFi.setHostname(newDeviceName);
      }
      
      WiFi.mode(WIFI_STA); //Optional
      WiFi.begin(ssid, password);
      Serial.println("\nConnecting");

      while(WiFi.status() != WL_CONNECTED){
        led.loop();
        Serial.print(".");
        delay(100);
      }
      led.doBlink(false);
      server.setup();
      Serial.println("\nConnected to the WiFi network");
      Serial.print("Local ESP32 IP: ");
      Serial.println(WiFi.localIP());
      Serial.print("ESP32 HostName: ");
      Serial.println(WiFi.getHostname());
      Serial.print("mDNS address: ");
      Serial.print(newDeviceName);
      Serial.println(".local");
      MDNS.begin(newDeviceName);

      if(deviceID == 0){

      }
    }
    void loop(){
      server.loop();
      if(WiFi.status() != WL_CONNECTED){
        led.doBlink(true);
      } else {
        led.doBlink(false);
        
      }

    }
    int getStatus(){
      return WiFi.status();
    }
    int getUniqueID(){
      if(WiFi.status() == WL_CONNECTED){
        HTTPClient http;

        String serverPath = "http://Plant-Master.local/setupNewDevice";
        http.begin(serverPath.c_str());

        int httpResponseCode = http.GET();

        if(httpResponseCode>0){
          Serial.print("HTTP Response Code: ");
          Serial.println(httpResponseCode);

          String payload = http.getString();
          Serial.println(payload);

        } else {
          Serial.print("Error Code: ");
          Serial.println(httpResponseCode);

        }

      http.end();
      } else {
        Serial.println("WiFi isnt connected");
      }
    }
  private:
    int deviceID;
    const char* ssid = "HomeAssistantTest";
    const char* password = "HomeAssistantTest";
    const char* deviceName = "Plant-Slave";
    const char* needAdopt = "Plant-Slave-Adopt-Me";
    ledController led;
    slaveWebServer server;

};