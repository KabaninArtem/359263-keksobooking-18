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
    removePins(mapPins);
    renderPins(newPins, mapPins);
  }

  function onFilterChange() {
    var originalData = cropData(window.pin.originalData);
    var houseTypeValue = housingType.value;
    var priceValue = price.value;
    var roomsValue = rooms.value;
    var guestsValue = guests.value;

    filteredPins = originalData.filter(function (pin) {
      return (houseTypeValue !== 'any' ? pin.offer.type === houseTypeValue : true)
        && (roomsValue !== 'any' ? pin.offer.rooms === +roomsValue : true)
        && (guestsValue !== 'any' ? pin.offer.guests === +guestsValue : true)
        && (priceFilter(priceValue, pin));
    });
    filteredPins = featuresFilter(featuresGroup, filteredPins);
    closeDescription();
    replacePins(filteredPins);
  }

  function priceFilter(filterName, pin) {
    switch (filterName) {
      case 'low':
        return pin.offer.price < LOW_PRICE;
      case 'middle':
        return pin.offer.price < MIDDLE_PRICE && pin.offer.price >= LOW_PRICE;
      case 'high':
        return pin.offer.price >= MIDDLE_PRICE;
      default:
        return true;
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
  var mapPins = document.querySelector('.map__pins');
  var filteredPins = [];

  form.addEventListener('change', debounce(onFilterChange));

  prepareFormInputs(form, true);
})();
