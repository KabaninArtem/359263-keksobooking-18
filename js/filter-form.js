'use strict';

(function () {
  var renderPins = window.pin.render;
  var removePins = window.adForm.removePins;

  function onHouseTypeChange(evt) {
    var pinsOriginal = window.pin.originalData;
    var filterBy = evt.target.value;
    var filtered = houseTypeFilter(filterBy, pinsOriginal);
    removePins();
    renderPins(filtered);
  }

  function houseTypeFilter(filterName, pins) {
    return pins.filter(function (pin) {
      return pin.offer.type === filterName;
    });
  }

  var form = document.querySelector('.map__filters');
  var housingType = form.querySelector('#housing-type');

  housingType.addEventListener('change', onHouseTypeChange);


})();
