# Air Quality Widget
A Web widget to visually show real-time air quality data. It depends on two libraries, [D3.js][d3-js] ([Liquid Fill Gauge][liquid-fill-gauge]) to show data visually and [Paho][paho] to get data from a MQTT server.

Go to the [widget demonstration page][demo] to see the visualized real-world air quality data. If the value on the widget always keeps zero, it means no one uploads air quality data to the MQTT broker/topic. And you can follow the [instruction][air-quality-monitoring-station] to setup one and show the data visually with the widget.

<p align="center">
  <a href="http://evanxd.io/air-quality-widget/"><img src="./images/demo.gif" /></a>
</p>

## How-to
This is a iframe-based widget. You can simply embed it into your web page with the below one line HTML code.
```html
<iframe src="http://evanxd.io/air-quality-widget/widget.html?mqtt=broker.mqtt-dashboard.com&port=8000&topic=topic" frameborder="0" scrolling="no"></iframe>
```

This is its URL search parameters to receive air quality data from a specific MQTT server or topic.
- Required
  - `topic`
    - A MQTT topic you receive the data from, the default value is `topic`.
- Optional
  - `mqtt`
    - A MQTT server address, the default value is `broker.mqtt-dashboard.com`.
  - `port`
    - A MQTT server port, the default value is `8000`.
  - `mode`
    - The widget mode you want to use, the default value is `average`.
      - `average` means show the one-minute average data.
      - `real-time` means show the real-time data at a moment.

The air quality data format/example on the MQTT broker topic is
```json
{ "pm1_0": 26, "pm2_5": 36, "pm10_0": 38 }
```
Please make sure you have same format data to use the widget, or just flash the [air-quality-monitoring-station][air-quality-monitoring-station] firmware into your device to do so.

[d3-js]: https://d3js.org/
[liquid-fill-gauge]: http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6
[paho]: http://www.eclipse.org/paho
[demo]: http://evanxd.io/air-quality-widget
[air-quality-monitoring-station]: https://github.com/evanxd/air-quality-monitoring-station
