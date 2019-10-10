'use strict';

(function () {
  var generateRandomValue = window.util.generateRandomValue;
  var getRandomElemFromArray = window.util.getRandomElemFromArray;
  var getRandomArray = window.util.getRandomArray;
  var PIN_TEMPLATE = {
    width: 65,
    height: 87
  };
  var MOCK_QUANTITY = 8;
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

  window.mock = {
    generateMockData: function (mapPins, length, mockInfo) {
      length = length || MOCK_QUANTITY;
      mockInfo = mockInfo || MOCK_INFO;
      var mapPosition = mapPins.getBoundingClientRect();
      var mocks = [];
      for (var i = 0; i < length; i++) {
        var mockData = {
          author: {
            avatar: mockInfo.avatarTemplate + (i + 1) + '.png',
          },
          offer: {
            title: 'title' + i,
            address: '',
            price: generateRandomValue(100),
            type: getRandomElemFromArray(mockInfo.type),
            rooms: generateRandomValue(3, 1),
            guests: generateRandomValue(3, 1),
            checkin: getRandomElemFromArray(mockInfo.times),
            checkout: getRandomElemFromArray(mockInfo.times),
            features: getRandomArray(mockInfo.features),
            description: 'description' + i,
            photos: getRandomArray(mockInfo.photos),
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
    },
    PIN_TEMPLATE: PIN_TEMPLATE
  };
})();
