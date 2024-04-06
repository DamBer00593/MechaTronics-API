class slaveWebServer{
  public:
    slaveWebServer(int port){
      server = WiFiServer(port);
    }
    void setup(){
      server.begin();
    }
    void loop(){
      WiFiClient client = server.available();

      if(client){
        currentTime = millis();
        previousTime = currentTime;
        Serial.println("New Client.");
        String currentLine = "";
        while (client.connected() && currentTime - previousTime <= timeoutTime){
          currentTime = millis();
          if (client.available()){
            char c = client.read();
            Serial.write(c);
            header += c;
            if (c == '\n'){
              if (currentLine.length() == 0){
                bool stuff = get_token(header, token, 1, ' ');
                bool stuffagain = get_token(token, token2, 1, '/');
                bool stuffagain1 = get_token(token, token3, 2, '/');

                client.println("HTTP/1.1 200 OK");
                client.println("Content-type:text/html");
                client.println("Connection: close");
                Serial.println(token);
                client.println();
                client.println(token2 + ", " + analogRead(token3.toInt()));
                // if(header.indexOf("GET /test") >= 0){
                  
                //   client.println(token);
                // }
                client.println();
                break;
              } else {
                currentLine = "";
              }
            } else if(c != '\r'){
              currentLine += c;
            }
          }
        }
        header = "";
        client.stop();
        Serial.println("Client Discconected");
        Serial.println("");
      }
    }
    
  private:
    int port;
    WiFiServer server;
    unsigned long currentTime = millis();
    unsigned long previousTime = 0;
    const long timeoutTime = 2000;
    String header, token, token2, token3;
    bool get_token(String &from, String &to, uint8_t index, char separator)
    {
      uint16_t start = 0, idx = 0;
      uint8_t cur = 0;
      while (idx < from.length())
      {
        if (from.charAt(idx) == separator)
        {
          if (cur == index)
          {
            to = from.substring(start, idx);
            return true;
          }
          cur++;
          while ((idx < from.length() - 1) && (from.charAt(idx + 1) == separator)) idx++;
          start = idx + 1;
        }
        idx++;
      }
      if ((cur == index) && (start < from.length()))
      {
        to = from.substring(start, from.length());
        return true;
      }
      return false;
    }
};