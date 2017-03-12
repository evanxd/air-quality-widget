'use strict';

var MQTT_SERVER_ADDRESS = "broker.mqtt-dashboard.com";
var MQTT_SERVER_PORT = 8000;
var MQTT_TOPIC = "topic";

(function() {
  var params = new URLSearchParams(window.location.search);
  var mqttServerAddress = params.get("server") || MQTT_SERVER_ADDRESS;
  var mqttServerPort = Number(params.get("port")) || MQTT_SERVER_PORT;
  var mqttTopic = params.get("topic") || MQTT_TOPIC;
  var mqttClientId = uuid.v4();

  var config = liquidFillGaugeDefaultSettings();
  config.displayPercent = false;
  var airQualityGauge = loadLiquidFillGauge("air-quality-widget", 0, config);

  // Show the real-time one-minute average data on the widget.
  // Workaround: Base on that the data sampling rate is a piece of data per two seconds,
  // we assume that the widget can receive 30 piece of data in a minute.
  var averageData = 0;
  var dataAmount = 0;
  var client = new Paho.MQTT.Client(mqttServerAddress, mqttServerPort, mqttClientId);
  client.onMessageArrived = function onMessageArrived(message) {
    console.log("data: " + message.payloadString);
    if (dataAmount < 30) {
      dataAmount++;
    }
    var data = JSON.parse(message.payloadString);
    averageData = (averageData * (dataAmount - 1) + data.pm2_5) / dataAmount;
    airQualityGauge.update(averageData);
  };
  client.onConnectionLost = function(response) {
    response.errorCode && connectServer();
  };

  connectServer();

  function connectServer() {
    console.log("Connecting the MQTT server...");
    client.connect({ onSuccess: function() {
      console.log("Connected with the MQTT server.");
      client.subscribe(mqttTopic);
    }});
  }
}());
