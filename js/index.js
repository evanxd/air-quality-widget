'use strict';

var MQTT_SERVER_ADDRESS = "broker.mqtt-dashboard.com";
var MQTT_SERVER_PORT = 8000;
var MQTT_TOPIC = "topic";
var WIDGET_MODE = "average"; // Currently, it supports average and real-time modes.

(function() {
  var params = new URLSearchParams(window.location.search);
  var mqttServerAddress = params.get("server") || MQTT_SERVER_ADDRESS;
  var mqttServerPort = Number(params.get("port")) || MQTT_SERVER_PORT;
  var mqttTopic = params.get("topic") || MQTT_TOPIC;
  var mqttClientId = uuid.v4();
  var widgetMode = params.get("mode") || WIDGET_MODE;

  var config = liquidFillGaugeDefaultSettings();
  config.displayPercent = false;
  config.waveHeight = 0;
  setDaqiColor(0);
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

    var pm2_5 = widgetMode === "average" ? averageData : data.pm2_5;
    setDaqiColor(pm2_5);
    airQualityGauge.update(pm2_5);
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

  function setDaqiColor(pm2_5) {
    if (pm2_5 >= 0 && pm2_5 <= 35) {
      config.circleColor = "#2D882D";
      config.waveColor = "#2D882D";
      config.textColor = "#106410";
      config.waveTextColor = "#85CA85";
    } else if (pm2_5 >= 36 && pm2_5 <= 53) {
      config.circleColor = "#F8F83F";
      config.waveColor = "#F8F83F";
      config.textColor = "#B9B903";
      config.waveTextColor = "#FFFF69";
    } else if (pm2_5 >= 54 && pm2_5 <= 70) {
      config.circleColor = "#F84C3F";
      config.waveColor = "#F84C3F";
      config.textColor = "#B91003";
      config.waveTextColor = "#FF7469";
    } else if (pm2_5 >= 71) {
      config.circleColor = "#4B2D74";
      config.waveColor = "#4B2D74";
      config.textColor = "#2F1355";
      config.waveTextColor = "#8D75AB";
    } else {
      config.circleColor = "#8E8E9B";
      config.waveColor = "#8E8E9B";
      config.textColor = "#535369";
      config.waveTextColor = "#B8B8BF";
    }
  }
}());
