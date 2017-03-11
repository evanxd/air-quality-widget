'use strict';

var MQTT_SERVER_ADDRESS = "broker.mqtt-dashboard.com";
var MQTT_SERVER_PORT = 8000;
var MQTT_CLIENT_ID = "clientId-Qqfjd";
var MQTT_TOPIC = "topic";

(function() {
  var params = new URLSearchParams(window.location.search);
  var mqttServerAddress = params.get("server") || MQTT_SERVER_ADDRESS;
  var mqttServerPort = Number(params.get("port")) || MQTT_SERVER_PORT;
  var mqttTopic = params.get("topic") || MQTT_TOPIC;

  var config = liquidFillGaugeDefaultSettings();
  config.displayPercent = false;
  var airQualityGauge = loadLiquidFillGauge("air-quality-widget", 0, config);
  var client = new Paho.MQTT.Client(mqttServerAddress, mqttServerPort, MQTT_CLIENT_ID);

  client.connect({ onSuccess: function() {
    console.log("Connected with the MQTT server.");
    client.subscribe(mqttTopic);
  }});

  client.onMessageArrived = function onMessageArrived(message) {
    console.log("data: " + message.payloadString);
    var data = JSON.parse(message.payloadString);
    airQualityGauge.update(data.pm2_5);
  }
}());
