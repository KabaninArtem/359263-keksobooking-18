'use strict';

(function () {
  var FEATURE_CLASS_TEMAPLTE = 'popup__feature--';
  var HUMANIZE_TYPE = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец',
  };

  function createDetailsPopUp(template, data, houseHumanizeType) {
    houseHumanizeType = houseHumanizeType || HUMANIZE_TYPE;
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
    type.textContent = houseHumanizeType[data.offer.type];
    capicity.textContent = data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей';
    time.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;
    description.textContent = data.offer.description;
    avatar.src = data.author.avatar;
    appendFeatureList(features, data.offer.features);
    appendPhotos(photos, data.offer.photos);
    return card;
  }

  function onDetailsPopUpKeydown() {
    window.detailsPopUp.close();
  }

  function onDetailsPopUpClick() {
    window.detailsPopUp.close();
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

  window.detailsPopUp = {
    open: function (data, filtersContainer) {
      var template = document.querySelector('#card');
      var card = createDetailsPopUp(template, data);
      var closeButton = card.querySelector('.popup__close');
      window.map.map.insertBefore(card, filtersContainer);
      document.addEventListener('keydown', onDetailsPopUpKeydown);
      closeButton.addEventListener('click', onDetailsPopUpClick);
    },
    close: function () {
      var activeCard = window.map.map.querySelector('.map__card');
      if (activeCard) {
        window.map.map.removeChild(activeCard);
      }
      document.removeEventListener('keydown', function (evt) {
        window.util.isEscEvent(evt, onDetailsPopUpKeydown);
      });
    }
  };
})();
