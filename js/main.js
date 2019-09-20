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
var MOCK_QUANTITY = 8;
var pinsMap = document.querySelector('.map__pins');
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

function createPin(info) {
  var pin = pinTemplate.element.content.cloneNode(true);
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
    fragment.appendChild(createPin(mocks[i]));
  }
  pinsMap.appendChild(fragment);
}

renderPins(generateMockData(MOCK_QUANTITY));
