'use strict';

(function () {
  var LOW_PRICE = 10 * 1000;
  var MIDDLE_PRICE = 50 * 1000;
  var renderPins = window.pin.render;
  var cropData = window.pin.cropData;
  var removePins = window.adForm.removePins;
  var debounce = window.debounce;

  function replacePins(newPins) {
    removePins();
    renderPins(newPins);
  }

  function onFilterChange() {
    var originalData = cropData(window.pin.originalData);
    var houseTypeValue = housingType.value;
    var priceValue = price.value;
    var roomsValue = rooms.value;
    var guestsValue = guests.value;

    filtered = houseTypeValue !== 'any' ? filterConstructor('type', houseTypeValue, originalData) : originalData;
    filtered = priceValue !== 'any' ? priceFilter(priceValue, filtered) : filtered;
    filtered = roomsValue !== 'any' ? filterConstructor('rooms', +roomsValue, filtered) : filtered;
    filtered = guestsValue !== 'any' ? filterConstructor('guests', +guestsValue, filtered) : filtered;
    replacePins(filtered);
  }

  function filterConstructor(filterField, filterName, pins) {
    return pins.filter(function (pin) {
      return pin.offer[filterField] === filterName;
    });
  }

  function priceFilter(filterName, pins) {
    switch (filterName) {
      case 'low':
        return pins.filter(function (pin) {
          return pin.offer.price < LOW_PRICE;
        });
      case 'middle':
        return pins.filter(function (pin) {
          return pin.offer.price < MIDDLE_PRICE && pin.offer.price >= LOW_PRICE;
        });
      case 'high':
        return pins.filter(function (pin) {
          return pin.offer.price >= MIDDLE_PRICE;
        });
      default:
        return pins;
    }
  }

  var form = document.querySelector('.map__filters');
  var housingType = form.querySelector('#housing-type');
  var price = form.querySelector('#housing-price');
  var rooms = form.querySelector('#housing-rooms');
  var guests = form.querySelector('#housing-guests');
  var filtered = [];

  housingType.addEventListener('change', debounce(onFilterChange));
  price.addEventListener('change', debounce(onFilterChange));
  rooms.addEventListener('change', debounce(onFilterChange));
  guests.addEventListener('change', debounce(onFilterChange));
})();
