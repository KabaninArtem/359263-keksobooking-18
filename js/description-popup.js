'use strict';

(function () {
  var FEATURE_CLASS_TEMAPLTE = 'popup__feature--';
  var HUMANIZE_TYPE = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец',
  };
  var isEscEvent = window.util.isEscEvent;

  function createDetailsPopUp(template, data) {
    var card = template.cloneNode(true).content;
    var title = card.querySelector('.popup__title');
    var address = card.querySelector('.popup__text--address');
    var price = card.querySelector('.popup__text--price');
    var type = card.querySelector('.popup__type');
    var capicity = card.querySelector('.popup__text--capacity');
    var time = card.querySelector('.popup__text--time');
    var description = card.querySelector('.popup__description');
    var avatar = card.querySelector('.popup__avatar');
    var features = card.querySelector('.popup__features');
    var photos = card.querySelector('.popup__photos');
    var imgTemplate = photos.querySelector('img');
    var closeButton = card.querySelector('.popup__close');

    title.textContent = data.offer.title || '';
    address.textContent = data.offer.address || '';
    price.textContent = data.offer.price + '₽/ночь' || '';
    type.textContent = HUMANIZE_TYPE[data.offer.type] || '';
    capicity.textContent = data.offer.rooms && data.offer.guests ? data.offer.rooms + ' комнаты для ' + data.offer.guests + ' гостей' : '';
    time.textContent = data.offer.checkin && data.offer.checkout ? 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout : '';
    description.textContent = data.offer.description || '';
    avatar.src = data.author.avatar || '';
    var featuresList = data.offer.features.length ? createFeatureList(features, data.offer.features) : [];
    var photosList = data.offer.photos.length ? createPhotos(imgTemplate, data.offer.photos) : [];
    features.innerHTML = '';
    features.appendChild(featuresList);
    photos.removeChild(imgTemplate);
    photos.appendChild(photosList);
    closeButton.addEventListener('click', close);
    return card;
  }

  function onPopUpEsc(evt) {
    isEscEvent(evt, close);
  }

  function close() {
    var activeCard = document.querySelector('.map__card');
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    if (activeCard) {
      activeCard.parentElement.removeChild(activeCard);
    }
    document.removeEventListener('keydown', onPopUpEsc);
  }

  function createFeatureList(container, features) {
    var fragment = document.createDocumentFragment();
    for (var i = 0, len = features.length; i < len; i++) {
      var feature = document.createElement('li');
      feature.classList.add('popup__feature', FEATURE_CLASS_TEMAPLTE + features[i]);
      fragment.appendChild(feature);
    }
    return fragment;
  }

  function createPhotos(template, photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0, len = photos.length; i < len; i++) {
      var img = template.cloneNode();
      img.src = photos[i];
      fragment.appendChild(img);
    }
    return fragment;
  }

  var cardTemplate = document.querySelector('#card');

  window.descriptionPopUp = {
    open: function (data, filtersContainer) {
      close();
      var card = createDetailsPopUp(cardTemplate, data);
      filtersContainer.parentElement.insertBefore(card, filtersContainer);
      document.addEventListener('keydown', onPopUpEsc);
    },
    close: close
  };
})();
