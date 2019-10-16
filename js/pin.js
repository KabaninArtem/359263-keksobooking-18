'use strict';

(function () {
  var isEnterEvent = window.util.isEnterEvent;
  var getPinPosition = window.util.getPinPosition;
  var openDetails = window.descriptionPopUp.open;
  var generateMockData = window.mock.generateMockData;
  var enableAdForm = window.adForm.enable;
  var PIN_TEMPLATE = window.mock.PIN_TEMPLATE;

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

  function setPinAddress(pin) {
    var addressInput = document.querySelector('#address');
    var position = getPinPosition(pin, PIN_TEMPLATE);
    addressInput.value = position.x + ', ' + position.y;
  }

  function mapEnable() {
    var mapPins = document.querySelector('.map__pins');
    var mocksList = generateMockData(mapPins);
    var map = document.querySelector('.map');
    var pins = createPins(mocksList, mapPins);
    map.classList.remove('map--faded');
    mapPins.appendChild(pins);
    setPinAddress(mainPin);
  }

  function activatePage() {
    mapEnable();
    enableAdForm();
    isActive = true;
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
