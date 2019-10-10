'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  function generateRandomValue(max, min) {
    min = min || 0;
    return Math.floor(min + Math.random() * (max - min));
  }

  window.util = {
    isEscEvent: function isEscEvent(evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function isEnterEvent(evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    getPinPosition: function (pin, template) {
      return {
        x: Math.floor(pin.offsetLeft + template.width / 2),
        y: Math.floor(pin.offsetTop + template.height),
      };
    },
    generateRandomValue: generateRandomValue,
    getRandomArray: function (array) {
      return array.slice(0, generateRandomValue(array.length));
    },
    getRandomElemFromArray: function (array) {
      return array[generateRandomValue(array.length)];
    }
  };
})();
