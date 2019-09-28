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
var HUMANIZE_TYPE = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
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

  return pin;
}

// function renderPins(mocks, pinsContainer) {
//   var fragment = document.createDocumentFragment();
//   var template = document.querySelector('#pin');
//   for (var i = 0, len = mocks.length; i < len; i++) {
//     fragment.appendChild(createPin(mocks[i], template));
//   }
//   pinsContainer.appendChild(fragment);
// }

function findElementByClass(parent, className) {
  return parent.querySelector(className);
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
  var title = findElementByClass(card, '.popup__title');
  var address = findElementByClass(card, '.popup__text--address');
  var price = findElementByClass(card, '.popup__text--price');
  var type = findElementByClass(card, '.popup__type');
  var capicity = findElementByClass(card, '.popup__text--capacity');
  var time = findElementByClass(card, '.popup__text--time');
  var features = findElementByClass(card, '.popup__features');
  var description = findElementByClass(card, '.popup__description');
  var photos = findElementByClass(card, '.popup__photos');
  var avatar = findElementByClass(card, '.popup__avatar ');
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

function renderDescriptionCard(data) {
  var template = document.querySelector('#card');
  var filtersContainer = document.querySelector('.map__filters-container');
  var card = createCard(template, data);
  filtersContainer.appendChild(card);
}

// renderPins(mocksList);
// renderDescriptionCard(mocksList[0])

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

function onRoomQuantityChange(evt) {
  var capacitySelect = document.querySelector('#capacity');
  var quantity = evt.target.value;
  capacitySelect.value = quantity !== NOT_FOR_GUESTS_QUANTITY ? quantity : NOT_FOR_GUESTS_VALUE;
}

var roomNumber = document.querySelector('#room_number');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var mocksList = generateMockData(MOCK_QUANTITY, mapPins);

prepareFormInputs(adForm, true);
setAddressOfPin(mainPin);

mainPin.addEventListener('mousedown', activatePage);
mainPin.addEventListener('keydown', onPinEnterPress);
roomNumber.addEventListener('change', onRoomQuantityChange);
