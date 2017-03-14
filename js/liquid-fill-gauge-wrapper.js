/* global loadLiquidFillGauge, liquidFillGaugeDefaultSettings */
'use strict';

(function(exports) {
  function LiquidFillGaugeWrapper(svgId, options) {
    options = options || {};
    var config = liquidFillGaugeDefaultSettings();
    var colors = this._getDaqiColors(0);
    for (key in options) {
      config[key] = options;
    }
    config.displayPercent = false;
    config.waveHeight = 0;
    config.circleColor = colors.circleColor;
    config.waveColor = colors.waveColor;
    config.textColor = colors.textColor;
    config.waveTextColor = colors.waveTextColor;
    this._liquidFillGauge = loadLiquidFillGauge(svgId, 0, config);
  }

  LiquidFillGaugeWrapper.prototype = {
    _liquidFillGauge: null,

    render: function(pm2_5) {
      this._liquidFillGauge.update(pm2_5);
    },

    _getDaqiColors: function(pm2_5) {
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
    },
  };

  exports.LiquidFillGaugeWrapper = LiquidFillGaugeWrapper;
}(window));
