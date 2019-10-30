'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var BIG_ROOM_QUANTITY = '100';
  var NOT_FOR_GUESTS = '0';
  var PRICES = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000,
  };
  var PHOTO_SIZES = {
    width: 40,
    height: 44
  };
  var URL = 'https://js.dump.academy/keksobooking';
  var setPinAddress = window.pin.setAddress;
  var setActivateListeners = window.pin.setActivateListeners;
  var restorePosition = window.pin.restorePosition;
  var createError = window.requestStatus.createError;
  var prepareFormInputs = window.util.prepareFormInputs;
  var createImg = window.util.createImg;
  var updateErrorMessage = window.requestStatus.updateErrorMessage;
  var createOverlayMessage = window.requestStatus.createOverlayMessage;
  var closePopUp = window.window.descriptionPopUp.close;
  var sendDataToServer = window.xhr.sendDataToServer;

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

  function onHouseTypeChange(evt, prices, elem) {
    var type = evt.target.value;
    var minPrice = prices[type] || 0;
    elem.min = minPrice;
    elem.placeholder = minPrice;
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
    sendDataToServer(URL, new FormData(adForm), success, error);
  }

  function onError(errorMessage) {
    var messageElem = createOverlayMessage(errorTemplate);
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
    var message = createOverlayMessage(successTemplate);
    document.body.appendChild(message);
    customFormReset();
  }

  function removePins(map) {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (pin) {
      map.removeChild(pin);
    });
  }

  function mapDisable(mapElem) {
    mapElem.classList.add('map--faded');
  }

  function customFormReset() {
    closePopUp();
    adForm.reset();
    filtersForm.reset();
    prepareFormInputs(filtersForm, false);
    disableForm();
    mapDisable(map);
    removePins(mapPins);
    restorePosition(pin);
    setPinAddress(pin, addressInput);
    setActivateListeners();
  }

  function onHousePhotoLoad(reader) {
    var img = housePhotos.querySelector('img');
    var readerResult = reader.result;
    if (!img) {
      var createdImg = createImg(readerResult, PHOTO_SIZES, 'Фотография жилья');
      housePhotos.appendChild(createdImg);
    } else {
      img.src = readerResult;
    }
  }

  function processUploaderImg(fileChooser, onLoad) {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();
    var matches = FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        onLoad(reader);
      });
      reader.readAsDataURL(file);
    }
  }

  var houseType = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var capacitySelect = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var adForm = document.querySelector('.ad-form');
  var adFormReset = document.querySelector('.ad-form__reset');
  var filtersForm = document.querySelector('.map__filters');
  var pin = document.querySelector('.map__pin--main');
  var headerUpload = document.querySelector('.ad-form-header__upload');
  var headerFileChooser = headerUpload.querySelector('input[type=file]');
  var housePhotoContainer = document.querySelector('.ad-form__photo-container');
  var housePhotos = housePhotoContainer.querySelector('.ad-form__photo');
  var housingPhotoFileChooser = housePhotoContainer.querySelector('input[type=file]');
  var headerPreview = headerUpload.querySelector('.ad-form-header__preview img');
  var priceElem = document.querySelector('#price');
  var map = document.querySelector('.map');
  var addressInput = document.querySelector('#address');
  var mapPins = document.querySelector('.map__pins');
  var errorTemplate = document.querySelector('#error');
  var successTemplate = document.querySelector('#success');


  headerFileChooser.addEventListener('change', function () {
    processUploaderImg(headerFileChooser, function (reader) {
      headerPreview.src = reader.result;
    });
  });

  housingPhotoFileChooser.addEventListener('change', function () {
    processUploaderImg(housingPhotoFileChooser, onHousePhotoLoad);
  });

  roomNumber.addEventListener('change', function (evt) {
    onRoomQuantityChange(evt, capacitySelect, BIG_ROOM_QUANTITY, NOT_FOR_GUESTS);
  });
  capacitySelect.addEventListener('change', function (evt) {
    onCapacityChange(evt, roomNumber, BIG_ROOM_QUANTITY, NOT_FOR_GUESTS);
  });
  houseType.addEventListener('change', function (evt) {
    onHouseTypeChange(evt, PRICES, priceElem);
  });
  timein.addEventListener('change', onTimeChange);
  timeout.addEventListener('change', onTimeChange);
  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    sendFormData(onSuccess, onError);
  });

  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    customFormReset();
  });

  disableForm();

  window.adForm = {
    removePins: removePins
  };
})();
