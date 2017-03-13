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
  var colors = getDaqiColors(0);
  config.displayPercent = false;
  config.waveHeight = 0;
  config.circleColor = colors.circleColor;
  config.waveColor = colors.waveColor;
  config.textColor = colors.textColor;
  config.waveTextColor = colors.waveTextColor;
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
    colors = getDaqiColors(pm2_5);
    config.circleColor = colors.circleColor;
    config.waveColor = colors.waveColor;
    config.textColor = colors.textColor;
    config.waveTextColor = colors.waveTextColor;
    airQualityGauge.update(pm2_5);
  };
  client.onConnectionLost = function(response) {
    response.errorCode && connectServer();
  };

  connectServer();

  function connectServer() {
    console.log("Connecting the MQTT server...");

    // This cutscene animation is for connecting the server.
    var currentValue = 0;
    var timer = setInterval(function() {
      currentValue = currentValue < 100 ? currentValue + 20 : 0;
      var colors = getDaqiColors(currentValue);
      config.circleColor = colors.circleColor;
      config.waveColor = colors.waveColor;
      config.textColor = colors.textColor;
      config.waveTextColor = colors.waveTextColor;
      airQualityGauge.update(currentValue);
    }, 1000);

    client.connect({ onSuccess: function() {
      console.log("Connected with the MQTT server.");
      clearInterval(timer);
      client.subscribe(mqttTopic);
    }});
  }

  function getDaqiColors(pm2_5) {
    var colors;
    if (pm2_5 >= 0 && pm2_5 < 36) {
      colors = ["#2D882D", "#2D882D", "#2D882D", "#106410"];
    } else if (pm2_5 >= 36 && pm2_5 < 54) {
      colors = ["#F8F83F", "#F8F83F", "#B9B903", "#FFFF69"];
    } else if (pm2_5 >= 54 && pm2_5 < 71) {
      colors = ["#F84C3F", "#F84C3F", "#B91003", "#FF7469"];
    } else if (pm2_5 >= 71 && pm2_5 < 100) {
      colors = ["#4B2D74", "#4B2D74", "#2F1355", "#8D75AB"];
    } else {
      colors = ["#8E8E9B", "#8E8E9B", "#535369", "#B8B8BF"];
    }
    return {
      circleColor: colors[0],
      waveColor: colors[1],
      textColor: colors[2],
      waveTextColor: colors[3],
    }
  }
}());
