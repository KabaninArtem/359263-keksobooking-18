'use strict';

(function () {
  window.activatePage = function () {
    window.pin.mapEnable();
    window.adForm.enable();
  };

  window.adForm.disable();
})();
