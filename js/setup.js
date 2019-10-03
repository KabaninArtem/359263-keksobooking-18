'use strict';

(function () {
  window.activatePage = function (pinsContainer) {
    var mocksList = window.mock.generateMockData(window.pin.pinsContainer);
    var pins = window.pin.createPins(mocksList, window.pin.pinsContainer);
    window.map.enable();
    window.adForm.enable();
    pinsContainer.appendChild(pins);
    window.pin.setAddressOfPin(window.pin.mainPin);
  };

  window.adForm.disable();
  window.pin.setAddressOfPin(window.pin.mainPin);
})();
