'use strict';

var mockInfo = {
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
var mockQuantity = 8;
var pinsMap = document.querySelector('.map__pins');
var pinsMapPosition = pinsMap.getBoundingClientRect();
var pinTemplate = {
  element: document.querySelector('#pin'),
  size: 65,
};

function generateRandomValue(max, min) {
  return Math.floor((min || 0) + Math.random() * (max - (min || 0)));
}

function generateMockData(mockQ) {
  var mocks = [];
  for (var i = 0; i < mockQ; i++) {
    var mockData = {
      author: {
        avatar: mockInfo.avatarTemplate + (i + 1) + '.png',
      },
      offer: {
        title: 'title' + i,
        address: '',
        price: generateRandomValue(100),
        type: mockInfo.type[Math.floor(Math.random() * mockInfo.type.length)],
        rooms: generateRandomValue(3, 1),
        guests: generateRandomValue(3, 1),
        checkin: mockInfo.times[generateRandomValue(mockInfo.times.length)],
        checkout: mockInfo.times[generateRandomValue(mockInfo.times.length)],
        features: mockInfo.features.slice(0, generateRandomValue(mockInfo.features.length)),
        description: 'description' + i,
        photos: mockInfo.photos.slice(0, generateRandomValue(mockInfo.photos.length)),
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

renderPins(generateMockData(mockQuantity));
