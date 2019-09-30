'use strict';

var ENTER_KEYCODE = 13;
var MOCK_INFO = {
  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
  type: ['palace', 'flat', 'house', 'bungalo'],
  times: ['12:00', '13:00', '14:00'],
  features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  avatarTemplate: 'img/avatars/user0'
};
var PRICES = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000,
};
var HUMANIZE_TYPE = {
  bungalo: 'Бунгало',
  flat: 'Квартира',
  house: 'Дом',
  palace: 'Дворец',
};
var FEATURE_CLASS_TEMAPLTE = 'popup__feature--';
var MOCK_QUANTITY = 8;
var NOT_FOR_GUESTS_QUANTITY = '100';
var NOT_FOR_GUESTS_VALUE = '0';
var PIN_TEMPLATE = {
  width: 65,
  height: 87
};

function generateRandomValue(max, min) {
  min = min || 0;
  return Math.floor(min + Math.random() * (max - min));
}

function getPinPosition(pin) {
  return {
    x: Math.floor(pin.offsetLeft + PIN_TEMPLATE.width / 2),
    y: Math.floor(pin.offsetTop + PIN_TEMPLATE.height),
  };
}

function getRandomArray(array) {
  return array.slice(0, generateRandomValue(array.length));
}

function getRandomElemFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMockData(length, mapPins) {
  var mapPosition = mapPins.getBoundingClientRect();
  var mocks = [];
  for (var i = 0; i < length; i++) {
    var mockData = {
      author: {
        avatar: MOCK_INFO.avatarTemplate + (i + 1) + '.png',
      },
      offer: {
        title: 'title' + i,
        address: '',
        price: generateRandomValue(100),
        type: getRandomElemFromArray(MOCK_INFO.type),
        rooms: generateRandomValue(3, 1),
        guests: generateRandomValue(3, 1),
        checkin: getRandomElemFromArray(MOCK_INFO.times),
        checkout: getRandomElemFromArray(MOCK_INFO.times),
        features: getRandomArray(MOCK_INFO.features),
        description: 'description' + i,
        photos: getRandomArray(MOCK_INFO.photos),
      },
      location: {
        x: generateRandomValue(mapPosition.right - (PIN_TEMPLATE.width / 2), mapPosition.left + (PIN_TEMPLATE.width / 2)),
        y: generateRandomValue(630, 130),
      }
    };
    mockData.offer.address = mockData.location.x + ', ' + mockData.location.y;
    mocks.push(mockData);
  }
  return mocks;
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
    closeDescriptionCard(map);
    openDescriptionCard(info, filtersContainer);
  });
  return pin;
}

function renderPins(mocks, pinsContainer) {
  var fragment = document.createDocumentFragment();
  var template = document.querySelector('#pin');
  for (var i = 0, len = mocks.length; i < len; i++) {
    fragment.appendChild(createPin(mocks[i], template));
  }
  pinsContainer.appendChild(fragment);
}

function appendFeatureList(container, features) {
  container.innerHTML = '';
  for (var i = 0, len = features.length; i < len; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature', FEATURE_CLASS_TEMAPLTE + features[i]);
    container.appendChild(feature);
  }
}

function appendPhotos(container, photos) {
  var imgTemplate = container.querySelector('img');
  for (var i = 0, len = photos.length; i < len; i++) {
    var img = imgTemplate.cloneNode();
    img.src = photos[i];
    container.appendChild(img);
  }
  container.removeChild(imgTemplate);
}

function createCard(template, data) {
  var card = template.cloneNode(true).content;
  var title = card.querySelector('.popup__title');
  var address = card.querySelector('.popup__text--address');
  var price = card.querySelector('.popup__text--price');
  var type = card.querySelector('.popup__type');
  var capicity = card.querySelector('.popup__text--capacity');
  var time = card.querySelector('.popup__text--time');
  var features = card.querySelector('.popup__features');
  var description = card.querySelector('.popup__description');
  var photos = card.querySelector('.popup__photos');
  var avatar = card.querySelector('.popup__avatar');
  title.textContent = data.offer.title;
  address.textContent = data.offer.address;
  price.textContent = data.offer.price + '₽/ночь';
  type.textContent = HUMANIZE_TYPE[data.offer.type];
  capicity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
  time.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
  description.textContent = data.offer.description;
  avatar.src = data.author.avatar;
  appendFeatureList(features, data.offer.features);
  appendPhotos(photos, data.offer.photos);
  return card;
}

function closeDescriptionCard(map) {
  var activeCard = map.querySelector('.map__card');
  if (activeCard) {
    map.removeChild(activeCard);
  }
}

function openDescriptionCard(data, filtersContainer) {
  var template = document.querySelector('#card');
  var card = createCard(template, data);
  var closeButton = card.querySelector('.popup__close');
  map.insertBefore(card, filtersContainer);
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeDescriptionCard(map);
    }
  });
  closeButton.addEventListener('click', function () {
    closeDescriptionCard(map);
  });
}

function prepareFormInputs(form, isDisabled) {
  var fieldsets = form.querySelectorAll('fieldset');

  for (var i = 0, len = fieldsets.length; i < len; i++) {
    fieldsets[i].disabled = isDisabled || false;
  }
}

function setAddressOfPin(pin) {
  var addressInput = document.querySelector('#address');
  var position = getPinPosition(pin);
  addressInput.value = position.x + ', ' + position.y;
}

function activatePage() {
  removeClass(map, 'map--faded');
  removeClass(adForm, 'ad-form--disabled');
  renderPins(mocksList, mapPins);
  prepareFormInputs(adForm, false);
  setAddressOfPin(mainPin);
}

function removeClass(elem, className) {
  elem.classList.remove(className);
}

function onPinEnterPress(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
}

function onRoomQuantityChange(evt, capacity) {
  var quantity = evt.target.value;

  if (quantity === NOT_FOR_GUESTS_QUANTITY) {
    capacity.value = NOT_FOR_GUESTS_VALUE;
  } else if (quantity === NOT_FOR_GUESTS_VALUE) {
    capacity.value = NOT_FOR_GUESTS_QUANTITY;
  } else {
    capacity.value = quantity;
  }
}

function onHouseTypeChange(evt) {
  var type = evt.target.value;
  var minPrice = PRICES[type] || 0;
  var priceElem = document.querySelector('#price');
  priceElem.min = minPrice;
  priceElem.placeholder = minPrice;
}

function onTimeChange(evt) {
  var activeElem = evt.target;
  var elemToChange = activeElem.id === 'timein' ? timeout : timein;
  elemToChange.value = activeElem.value;
}

var roomNumber = document.querySelector('#room_number');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var houseType = document.querySelector('#type');
var timein = document.querySelector('#timein');
var timeout = document.querySelector('#timeout');
var adForm = document.querySelector('.ad-form');
var filtersContainer = document.querySelector('.map__filters-container');
var capacitySelect = document.querySelector('#capacity');
var mocksList = generateMockData(MOCK_QUANTITY, mapPins);

prepareFormInputs(adForm, true);
setAddressOfPin(mainPin);
mainPin.addEventListener('mousedown', activatePage);
mainPin.addEventListener('keydown', onPinEnterPress);
roomNumber.addEventListener('change', function (evt) {
  onRoomQuantityChange(evt, capacitySelect);
});
capacitySelect.addEventListener('change', function (evt) {
  onRoomQuantityChange(evt, roomNumber);
});
houseType.addEventListener('change', onHouseTypeChange);
timein.addEventListener('change', onTimeChange);
timeout.addEventListener('change', onTimeChange);
