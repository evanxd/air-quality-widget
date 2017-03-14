/* global LiquidFillGaugeWrapper */
'use strict';

(function(exports) {
  function AirQualityBlock(svgSelector, type, options) {
    var airQualityBlock = null;
    switch (type) {
      case "LiquidFillGauge":
        // The LiquidFillGauge block only supports the element selector started with "#",
        // which means select the svg by its element ID.
        if (svgSelector.startsWith("#")) {
          airQualityBlock = new LiquidFillGaugeWrapper(svgSelector.substr(1), options);
        }
        break;
    }
    return airQualityBlock;
  }

  exports.AirQualityBlock = AirQualityBlock;
}(window));
