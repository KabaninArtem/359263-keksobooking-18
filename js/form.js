'use strict';

(function () {
  var BIG_ROOM_QUANTITY = '100';
  var NOT_FOR_GUESTS = '0';
  var PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  var houseType = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var capacitySelect = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var adForm = document.querySelector('.ad-form');

  function onRoomQuantityChange(evt, capacity, bigRoomQuantity, notForGuests) {
    var quantity = evt.target.value;
    capacity.value = quantity === bigRoomQuantity ? notForGuests : calculateCapacity(quantity, capacity.value, notForGuests);
  }

  function onCapacityChange(evt, roomQuantity, bigRoomQuantity, notForGuests) {
    var capacity = evt.target.value;
    roomQuantity.value = capacity === notForGuests ? bigRoomQuantity : calculateRoomQuantity(roomQuantity.value, capacity, bigRoomQuantity);
  }

  function calculateCapacity(roomQuantity, capacity, notForQuests) {
    return +roomQuantity < +capacity || capacity === notForQuests ? roomQuantity : capacity;
  }

  function calculateRoomQuantity(roomQuantity, capacity, bigRoomQuantity) {
    return +capacity > +roomQuantity || roomQuantity === bigRoomQuantity ? capacity : roomQuantity;
  }

  function onHouseTypeChange(evt, prices) {
    var type = evt.target.value;
    var minPrice = prices[type] || 0;
    var priceElem = document.querySelector('#price');
    priceElem.min = minPrice;
    priceElem.placeholder = minPrice;
  }

  function onTimeChange(evt) {
    var activeElem = evt.target;
    var elemToChange = activeElem.id === 'timein' ? timeout : timein;
    elemToChange.value = activeElem.value;
  }

  roomNumber.addEventListener('change', function (evt) {
    onRoomQuantityChange(evt, capacitySelect, BIG_ROOM_QUANTITY, NOT_FOR_GUESTS);
  });
  capacitySelect.addEventListener('change', function (evt) {
    onCapacityChange(evt, roomNumber, BIG_ROOM_QUANTITY, NOT_FOR_GUESTS);
  });
  houseType.addEventListener('change', function (evt) {
    onHouseTypeChange(evt, PRICES);
  });
  timein.addEventListener('change', onTimeChange);
  timeout.addEventListener('change', onTimeChange);

  window.prepareFormInputs = function (form, isDisabled) {
    var fieldsets = form.querySelectorAll('fieldset');

    for (var i = 0, len = fieldsets.length; i < len; i++) {
      fieldsets[i].disabled = isDisabled || false;
    }
  };
  window.adForm = {
    enable: function () {
      adForm.classList.remove('ad-form--disabled');
    },
    prepareFormInputs: function (isDisabled) {
      var fieldsets = adForm.querySelectorAll('fieldset');

      for (var i = 0, len = fieldsets.length; i < len; i++) {
        fieldsets[i].disabled = isDisabled || false;
      }
    }
  };
})();
