'use strict';

(function () {
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
            price: window.util.generateRandomValue(100),
            type: window.util.getRandomElemFromArray(mockInfo.type),
            rooms: window.util.generateRandomValue(3, 1),
            guests: window.util.generateRandomValue(3, 1),
            checkin: window.util.getRandomElemFromArray(mockInfo.times),
            checkout: window.util.getRandomElemFromArray(mockInfo.times),
            features: window.util.getRandomArray(mockInfo.features),
            description: 'description' + i,
            photos: window.util.getRandomArray(mockInfo.photos),
          },
          location: {
            x: window.util.generateRandomValue(mapPosition.right - (window.PIN_TEMPLATE.width / 2), mapPosition.left + (window.PIN_TEMPLATE.width / 2)),
            y: window.util.generateRandomValue(630, 130),
          }
        };
        mockData.offer.address = mockData.location.x + ', ' + mockData.location.y;
        mocks.push(mockData);
      }
      return mocks;
    }
  };
})();
