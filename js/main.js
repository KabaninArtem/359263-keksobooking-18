'use strict';

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
var featureClassTemplate = 'popup__feature--';
var MOCK_QUANTITY = 8;
var mocksList = generateMockData(MOCK_QUANTITY);
var pinsMap = document.querySelector('.map__pins');
var cardTemplate = document.querySelector('#card');
var filtersContainer = document.querySelector('.map__filters-container');
var pinsMapPosition = pinsMap.getBoundingClientRect();
var pinTemplate = {
  element: document.querySelector('#pin'),
  size: 65,
};

function generateRandomValue(max, min) {
  min = min || 0;
  return Math.floor(min + Math.random() * (max - min));
}

function getRandomArray(array) {
  return array.slice(0, generateRandomValue(array.length));
}

function getRandomElemFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMockData(length) {
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
        x: generateRandomValue(pinsMapPosition.right - (pinTemplate.size / 2), pinsMapPosition.left + (pinTemplate.size / 2)),
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

function renderPins(mocks) {
  var fragment = document.createDocumentFragment();
  for (var i = 0, len = mocks.length; i < len; i++) {
    fragment.appendChild(createPin(mocks[i], pinTemplate.element));
  }
  pinsMap.appendChild(fragment);
}

function findElementByClass(parent, className) {
  return parent.querySelector(className);
}

function appendFeatureList(container, features) {
  container.innerHTML = '';
  for (var i = 0, len = features.length; i < len; i++) {
    var feature = document.createElement('li');
    feature.classList.add('popup__feature', featureClassTemplate + features[i]);
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

function renderDescriptionCard(template, data) {
  var card = createCard(template, data);
  filtersContainer.appendChild(card);
}

renderPins(mocksList);
renderDescriptionCard(cardTemplate, mocksList[0]);
