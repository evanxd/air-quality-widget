# Air Quality Widget
A Web widget to visually show real-time air quality data. It depends on two libraries, [D3.js][d3-js] ([Liquid Fill Gauge][liquid-fill-gauge]) to show data visually and [Paho][paho] to get data from a MQTT server. Check the [demo here][demo].

![Screenshot](./images/screenshot.png)

## How-to
This is a iframe-based widget. You can simply embed it into your web page with the below one line HTML code.
```html
<iframe src="http://evanxd.io/air-quality-widget/widget.html?mqtt=broker.mqtt-dashboard.com&port=8000&topic=topic" frameborder="0" scrolling="no"></iframe>
```

This is its URL search parameters to receive the real-time air quality data from a specific MQTT server or topic.
- `mqtt`
  - A MQTT server address, like `broker.mqtt-dashboard.com` in our [example][example].
- `port`
  - A MQTT server port, like `8000` in our [example][example].
- `topic`
  - A MQTT topic you receive the data from, like `topic` in our [example][example].

[d3-js]: https://d3js.org/
[liquid-fill-gauge]: http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6
[paho]: http://www.eclipse.org/paho
[demo]: http://evanxd.io/air-quality-widget
[example]: https://github.com/evanxd/air-quality-widget/blob/master/index.html#L39
