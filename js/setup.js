'use strict';

(function () {
  window.activatePage = function (pinsContainer) {
    var mocksList = window.mock.generateMockData(window.pin.pinsContainer);
    var pins = window.pin.createPins(mocksList, window.pin.pinsContainer);
    window.map.enable();
    window.adForm.enable();
    pinsContainer.appendChild(pins);
    window.adForm.prepareFormInputs(false);
    window.pin.setAddressOfPin(window.pin.mainPin);
  };

  window.adForm.prepareFormInputs(true);
  window.pin.setAddressOfPin(window.pin.mainPin);
})();
