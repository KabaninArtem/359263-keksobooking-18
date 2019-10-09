'use strict';

(function () {
  window.PIN_TEMPLATE = {
    width: 65,
    height: 87
  };

  function onPinActivate() {
    window.activatePage();
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
      window.detailsPopUp.close();
      window.detailsPopUp.open(info, filtersContainer);
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
    var position = window.util.getPinPosition(pin, window.PIN_TEMPLATE);
    addressInput.value = position.x + ', ' + position.y;
  }

  var mainPin = document.querySelector('.map__pin--main');
  var filtersContainer = document.querySelector('.map__filters-container');

  window.pin = {
    mapEnable: function () {
      var mapPins = document.querySelector('.map__pins');
      var mocksList = window.mock.generateMockData(mapPins);
      var map = document.querySelector('.map');
      var pins = createPins(mocksList, mapPins);
      map.classList.remove('map--faded');
      mapPins.appendChild(pins);
      setPinAddress(mainPin);
    }
  };

  mainPin.addEventListener('mousedown', onPinActivate);
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, onPinActivate);
  });
})();
