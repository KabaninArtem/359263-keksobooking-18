'use strict';

(function () {
  var isEnterEvent = window.util.isEnterEvent;
  var openDetails = window.descriptionPopUp.open;
  var enableAdForm = window.adForm.enable;
  var setPinAddress = window.adForm.setPinAddress;
  var createError = window.xhr.createError;
  var updateErrorMessage = window.xhr.updateErrorMessage;
  var closeOverlay = window.xhr.closeOverlay;
  var getDataFromServer = window.xhr.getDataFromServer;
  var GET_ADS_URL = 'https://js.dump.academy/keksobooking/data';

  function onPinActivate(evt) {
    if (!isActive) {
      activatePage();
    }
    dragPin(evt, DRAG_LIMIT);
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
        setPinAddress(mainPin);
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
    });
    return pin;
  }

  function createPins(mocks) {
    var fragment = document.createDocumentFragment();
    var template = document.querySelector('#pin');
    for (var i = 0, len = mocks.length; i < len; i++) {
      fragment.appendChild(createPin(mocks[i], template));
    }
    return fragment;
  }

  function mapEnable() {
    getDataFromServer(GET_ADS_URL, onSuccess, onError);
    var map = document.querySelector('.map');
    map.classList.remove('map--faded');
    setPinAddress(mainPin);
  }

  function activatePage() {
    mapEnable();
    enableAdForm();
    isActive = true;
  }

  function onSuccess(data) {
    var mapPins = document.querySelector('.map__pins');
    var pins = createPins(data, mapPins);
    mapPins.appendChild(pins);
  }

  function tryAgainSuccessHandler(data) {
    onSuccess(data);
    closeOverlay();
  }

  function onError(errorMessage) {
    var message = createError(errorMessage, GET_ADS_URL, tryAgainSuccessHandler, updateErrorMessage);
    document.body.appendChild(message);
  }

  var mainPin = document.querySelector('.map__pin--main');
  var filtersContainer = document.querySelector('.map__filters-container');
  var isActive = false;
  var DRAG_LIMIT = {
    maxY: 630,
    minY: 130,
    minX: 0,
    maxX: mainPin.parentElement.offsetWidth - mainPin.offsetWidth
  };

  mainPin.addEventListener('mousedown', onPinActivate);
  mainPin.addEventListener('keydown', function (evt) {
    isEnterEvent(evt, onPinActivate);
  });
})();
