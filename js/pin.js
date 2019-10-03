'use strict';

(function () {
  window.PIN_TEMPLATE = {
    width: 65,
    height: 87
  };
  var mainPin = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');
  var filtersContainer = document.querySelector('.map__filters-container');

  function onPinActivate() {
    window.activatePage(mapPins);
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

  window.pin = {
    createPins: function (mocks) {
      var fragment = document.createDocumentFragment();
      var template = document.querySelector('#pin');
      for (var i = 0, len = mocks.length; i < len; i++) {
        fragment.appendChild(createPin(mocks[i], template));
      }
      return fragment;
    },
    setAddressOfPin: function (pin) {
      var addressInput = document.querySelector('#address');
      var position = window.util.getPinPosition(pin, window.PIN_TEMPLATE);
      addressInput.value = position.x + ', ' + position.y;
    },
    mainPin: mainPin,
    pinsContainer: mapPins
  };

  mainPin.addEventListener('mousedown', onPinActivate);
  mainPin.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, onPinActivate);
  });
})();
