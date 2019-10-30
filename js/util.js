'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  window.util = {
    prepareFormInputs: function (form, isDisabled) {
      var children = form.children;
      children.forEach(function (child) {
        child.disabled = isDisabled || false;
      });
    },
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
    createImg: function (result, sizes, alt) {
      var img = new Image(sizes.width, sizes.height);
      img.src = result;
      img.alt = alt;
      return img;
    }
  };
})();
