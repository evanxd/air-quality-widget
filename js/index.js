/* global AirQualityBlock */
'use strict';

var MQTT_SERVER_ADDRESS = "broker.mqtt-dashboard.com";
var MQTT_SERVER_PORT = 8000;
var MQTT_TOPIC = "topic";
var WIDGET_MODE = "average"; // Currently, it supports average and real-time modes.
var WIDGET_THEME = "LiquidFillGauge";
var EXAMPLE_UUID = "123e4567-e89b-12d3-a456-426655440000";

(function() {
  var params = new URLSearchParams(window.location.search);
  var mqttServerAddress = params.get("server") || MQTT_SERVER_ADDRESS;
  var mqttServerPort = Number(params.get("port")) || MQTT_SERVER_PORT;
  var mqttClientId = uuid && typeof uuid.v4 === "function" ? uuid.v4() : EXAMPLE_UUID;
  var mqttTopic = params.get("topic") || MQTT_TOPIC;
  var widgetMode = params.get("mode") || WIDGET_MODE;
  var widgetTheme = params.get("theme") || WIDGET_THEME;
  var airQualityBlock = new AirQualityBlock("#air-quality-widget", widgetTheme);

  // Show the real-time one-minute average data on the widget.
  // Workaround: Base on that the data sampling rate is a piece of data per two seconds,
  // we assume that the widget can receive 30 piece of data in a minute.
  var averageData = 0;
  var dataAmount = 0;
  var client = new Paho.MQTT.Client(mqttServerAddress, mqttServerPort, mqttClientId);
  client.onMessageArrived = function onMessageArrived(message) {
    console.log("data: " + message.payloadString);
    try {
      var pm2_5 = JSON.parse(message.payloadString).pm2_5;
      if (!Number.isInteger(pm2_5) || pm2_5 < 0) {
        throw new Error("PM2.5 value should be a positive integer");
      }
      dataAmount < 30 && dataAmount++;
      averageData = (averageData * (dataAmount - 1) + pm2_5) / dataAmount;
      airQualityBlock.render(widgetMode === "average" ? averageData : pm2_5);
    } catch (e) {
      console.log(e.message);
    }
  };
  client.onConnectionLost = function(response) {
    response.errorCode && connectServer();
  };
  connectServer();

  function connectServer() {
    console.log("Connecting the MQTT server...");
    client.connect({onSuccess: function() {
      console.log("Connected with the MQTT server.");
      client.subscribe(mqttTopic);
    }});
  }
}());
