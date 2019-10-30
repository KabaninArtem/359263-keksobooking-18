'use strict';

(function () {
  var GET_ADS_URL = 'https://js.dump.academy/keksobooking/data';
  var PIN_TEMPLATE = {
    width: 65,
    height: 87
  };
  var MAX_PINS_QUANTITY = 5;
  var isEnterEvent = window.util.isEnterEvent;
  var prepareFormInputs = window.util.prepareFormInputs;
  var getPinPosition = window.util.getPinPosition;
  var openDetails = window.descriptionPopUp.open;
  var createError = window.requestStatus.createError;
  var updateErrorMessage = window.requestStatus.updateErrorMessage;
  var createOverlayMessage = window.requestStatus.createOverlayMessage;
  var getDataFromServer = window.xhr.getDataFromServer;
  var pinPosition = {};

  function onPinActivate(evt) {
    if (!isActive) {
      activatePage();
    }
    dragPin(evt, new DragLimit(mainPin));
  }

  function dragPin(evt, limit) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var pinY = (mainPin.offsetTop - shift.y);
      var pinX = (mainPin.offsetLeft - shift.x);

      if (pinY >= limit.minY && pinY <= limit.maxY && pinX > limit.minX && pinX <= limit.maxX) {
        mainPin.style.top = pinY + 'px';
        mainPin.style.left = pinX + 'px';
        setPinAddress(mainPin, addressInput);
      }
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function createPin(info, template) {
    var pin = template.content.cloneNode(true);
    var pinButton = pin.querySelector('button');
    var pinImg = pin.querySelector('img');
    pinButton.style.left = info.location.x + 'px';
    pinButton.style.top = info.location.y + 'px';
    pinImg.src = info.author.avatar;
    pinImg.alt = info.offer.title;
    pinButton.addEventListener('click', function () {
      openDetails(info, filtersContainer);
      pinButton.classList.add('map__pin--active');
    });
    return pin;
  }

  function createPins(pinsData, template) {
    var fragment = document.createDocumentFragment();
    pinsData.forEach(function (pinData) {
      if (pinData.offer) {
        fragment.appendChild(createPin(pinData, template));
      }
    });
    return fragment;
  }

  function renderPins(croppedPinsList, map) {
    if (croppedPinsList.length) {
      var pins = createPins(croppedPinsList, template);
      map.appendChild(pins);
    }
  }

  function getPinData(success, error) {
    getDataFromServer(GET_ADS_URL, success, error);
  }

  function savePinState(pin) {
    pinPosition['top'] = pin.style.top;
    pinPosition['left'] = pin.style.left;
  }

  function restorePosition(pin) {
    pin.style.top = pinPosition['top'];
    pin.style.left = pinPosition['left'];
  }

  function mapEnable(map) {
    getPinData(onSuccess, onError);
    map.classList.remove('map--faded');
    setPinAddress(mainPin, addressInput);
  }

  function formEnable(form) {
    form.classList.remove('ad-form--disabled');
    prepareFormInputs(form, false);
    savePinState(mainPin);
  }

  function activatePage() {
    mapEnable(map);
    formEnable(adForm);
    isActive = true;
  }

  function cropData(pinsData, length) {
    length = length || MAX_PINS_QUANTITY;
    return pinsData.slice(0, length);
  }

  function onSuccess(data) {
    window.pin.originalData = data;
    var croppedPinsList = cropData(data);
    prepareFormInputs(filtersForm, false);
    renderPins(croppedPinsList, mapPins);
  }

  function onError(errorMessage) {
    var overlayElem = createOverlayMessage(errorTemplate);
    createError(overlayElem, errorMessage, againServerRequest);

    function againServerRequest() {
      getPinData(onAgainSuccess, onAgainError);
    }

    function onAgainSuccess(data) {
      onSuccess(data);
      document.body.removeChild(overlayElem);
    }

    function onAgainError(error) {
      updateErrorMessage(overlayElem, error);
    }

    document.body.appendChild(overlayElem);
  }

  function setPinAddress(pin, input) {
    var position = getPinPosition(pin, PIN_TEMPLATE);
    input.value = position.x + ', ' + position.y;
  }

  function DragLimit(pin) {
    this.maxY = 630 - PIN_TEMPLATE.height;
    this.minY = 130 - PIN_TEMPLATE.height;
    this.minX = 0;
    this.maxX = pin.parentElement.offsetWidth - pin.offsetWidth;
  }

  function setActivateListeners() {
    isActive = false;
    mainPin.addEventListener('mousedown', onPinActivate);
    mainPin.addEventListener('keydown', function (evt) {
      isEnterEvent(evt, onPinActivate);
    });
  }

  var mainPin = document.querySelector('.map__pin--main');
  var filtersContainer = document.querySelector('.map__filters-container');
  var filtersForm = document.querySelector('.map__filters');
  var template = document.querySelector('#pin');
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var addressInput = document.querySelector('#address');
  var errorTemplate = document.querySelector('#error');
  var isActive = false;

  setActivateListeners();
  window.pin = {
    setAddress: setPinAddress,
    restorePosition: restorePosition,
    setActivateListeners: setActivateListeners,
    render: renderPins,
    cropData: cropData,
    originalData: [],
  };
})();
