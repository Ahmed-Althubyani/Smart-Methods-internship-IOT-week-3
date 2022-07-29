#include <Servo.h>;

Servo servo1;

void setup() {
  Serial.begin(9600);
  servo1.attach(9);
}

void loop() {
  if(Serial.available()){
    servo1.write(Serial.read());
    }
}
