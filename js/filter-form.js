'use strict';

(function () {
  var LOW_PRICE = 10 * 1000;
  var MIDDLE_PRICE = 50 * 1000;
  var renderPins = window.pin.render;
  var cropData = window.pin.cropData;
  var removePins = window.adForm.removePins;
  var closeDescription = window.descriptionPopUp.close;
  var debounce = window.debounce;
  var prepareFormInputs = window.util.prepareFormInputs;

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

    filteredPins = houseTypeValue !== 'any' ? filterConstructor('type', houseTypeValue, originalData) : originalData;
    filteredPins = priceValue !== 'any' ? priceFilter(priceValue, filteredPins) : filteredPins;
    filteredPins = roomsValue !== 'any' ? filterConstructor('rooms', +roomsValue, filteredPins) : filteredPins;
    filteredPins = guestsValue !== 'any' ? filterConstructor('guests', +guestsValue, filteredPins) : filteredPins;
    filteredPins = featuresFilter(featuresGroup, filteredPins);
    closeDescription();
    replacePins(filteredPins);
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

  function featuresFilter(featuresGroup, data) {
    var features = getSelectedFeatures();
    return data.filter(function (dataItem) {
      var itemFeatures = dataItem.offer.features;
      return itemFeatures.length >= features.length && checkFeaturesFilterMatch(itemFeatures);
    });

    function checkFeaturesFilterMatch(featuresList) {
      return features.every(function (item) {
        return featuresList.indexOf(item) !== -1;
      });
    }
  }

  function getSelectedFeatures() {
    var features = Array.from(featuresGroup.querySelectorAll('input:checked'));
    return features.map(function (feature) {
      return feature.value;
    });
  }

  var form = document.querySelector('.map__filters');
  var housingType = form.querySelector('#housing-type');
  var price = form.querySelector('#housing-price');
  var rooms = form.querySelector('#housing-rooms');
  var guests = form.querySelector('#housing-guests');
  var featuresGroup = form.querySelector('#housing-features');
  var filterWifi = form.querySelector('#filter-wifi');
  var filterDishwasher = form.querySelector('#filter-dishwasher');
  var filterParking = form.querySelector('#filter-parking');
  var filterWasher = form.querySelector('#filter-washer');
  var filterElevator = form.querySelector('#filter-elevator');
  var filterConditioner = form.querySelector('#filter-conditioner');
  var filteredPins = [];

  housingType.addEventListener('change', debounce(onFilterChange));
  price.addEventListener('change', debounce(onFilterChange));
  rooms.addEventListener('change', debounce(onFilterChange));
  guests.addEventListener('change', debounce(onFilterChange));
  filterWifi.addEventListener('change', debounce(onFilterChange));
  filterDishwasher.addEventListener('change', debounce(onFilterChange));
  filterParking.addEventListener('change', debounce(onFilterChange));
  filterWasher.addEventListener('change', debounce(onFilterChange));
  filterElevator.addEventListener('change', debounce(onFilterChange));
  filterConditioner.addEventListener('change', debounce(onFilterChange));

  prepareFormInputs(form, true);
})();
