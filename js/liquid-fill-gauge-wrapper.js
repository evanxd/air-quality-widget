/* global loadLiquidFillGauge, liquidFillGaugeDefaultSettings */
'use strict';

(function(exports) {
  function LiquidFillGaugeWrapper(svgId, options) {
    options = options || {};
    this._options = liquidFillGaugeDefaultSettings();
    var colors = this._getDaqiColors(0);
    for (key in options) {
      this._options[key] = options;
    }
    this._options.displayPercent = false;
    this._options.waveHeight = 0;
    this._options.circleColor = colors.circleColor;
    this._options.waveColor = colors.waveColor;
    this._options.textColor = colors.textColor;
    this._options.waveTextColor = colors.waveTextColor;
    this._liquidFillGauge = loadLiquidFillGauge(svgId, 0, this._options);
  }

  LiquidFillGaugeWrapper.prototype = {
    _options: null,
    _liquidFillGauge: null,

    render: function(pm2_5) {
      var colors = this._getDaqiColors(pm2_5);
      this._options.circleColor = colors.circleColor;
      this._options.waveColor = colors.waveColor;
      this._options.textColor = colors.textColor;
      this._options.waveTextColor = colors.waveTextColor;
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
