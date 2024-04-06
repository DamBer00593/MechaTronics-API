class ledController{
  public:
    ledController(int ledPin, int delayMS):ledPin(ledPin), delayMS(delayMS){}
    void setup(){
      pinMode(ledPin, OUTPUT);
    }
    void doBlink(bool value){
      flashing = value;
    }
    void loop(){
      if(flashing){
        unsigned long delta = millis() - tLastChange;
        if(tLastChange == 0 || delta >= delayMS){
           setState(!currentState);
        }
      }
    }
  private:
    int ledPin, delayMS;
    bool flashing;
    int currentState = 0;
    unsigned long tLastChange = 0;
    void setState(int state){
      digitalWrite(ledPin, currentState = state);
      tLastChange = millis();
    }
};