'use strict';

(function () {
  var setPinAddress = window.pin.setAddress;
  var setActivateListeners = window.pin.setActivateListeners;
  var restorePinPosition = window.pin.restorePinPosition;
  var createError = window.requestStatus.createError;
  var prepareFormInputs = window.util.prepareFormInputs;
  var updateErrorMessage = window.requestStatus.updateErrorMessage;
  var createOverlayMessage = window.requestStatus.createOverlayMessage;
  var BIG_ROOM_QUANTITY = '100';
  var NOT_FOR_GUESTS = '0';
  var PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  var URL = 'https://js.dump.academy/keksobooking';

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

  function disableForm() {
    adForm.classList.add('ad-form--disabled');
    prepareFormInputs(adForm, true);
  }

  function sendFormData(success, error) {
    window.xhr.sendDataToServer(URL, new FormData(adForm), success, error);
  }

  function onError(errorMessage) {
    var messageElem = createOverlayMessage('error');
    createError(messageElem, errorMessage, sendFormDataAgain);

    function sendFormDataAgain() {
      sendFormData(onAgainSuccess, onAgainError);
    }
    function onAgainSuccess() {
      document.removeChild(messageElem);
      onSuccess();
    }

    function onAgainError(err) {
      updateErrorMessage(messageElem, err);
    }

    document.body.appendChild(messageElem);
  }

  function onSuccess() {
    var message = createOverlayMessage('success');
    document.body.appendChild(message);
    adForm.reset();
    disableForm();
    mapDisable();
    removePins();
    restorePinPosition(pin);
    setPinAddress(pin);
    setActivateListeners();
  }

  function removePins() {
    var mapPins = document.querySelector('.map__pins');
    var pins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0, length = pins.length; i < length; i++) {
      mapPins.removeChild(pins[i]);
    }
  }

  function mapDisable() {
    var map = document.querySelector('.map');
    map.classList.add('map--faded');
  }

  var houseType = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var capacitySelect = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var adForm = document.querySelector('.ad-form');
  var pin = document.querySelector('.map__pin--main');

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
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    sendFormData(onSuccess, onError);
  });

  disableForm();

  window.adForm = {
    removePins: removePins
  };
})();
