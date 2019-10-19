'use strict';

(function () {
  var isEscEvent = window.util.isEscEvent;

  function getOverlayTemplate(status) {
    var template = document.querySelector('#' + status).content.cloneNode(true);
    return template.querySelector('.' + status);
  }

  function createOverlayMessage(status) {
    var template = getOverlayTemplate(status);
    template.id = 'overlayMessage';
    document.addEventListener('keydown', onOverlayEscPress);
    template.addEventListener('click', closeOverlay);
    return template;
  }

  function onOverlayEscPress(evt) {
    isEscEvent(evt, closeOverlay);
  }

  function closeOverlay() {
    var overlay = document.querySelector('#overlayMessage');
    document.body.removeChild(overlay);
    document.removeEventListener('keydown', onOverlayEscPress);
  }

  function createError(errorMessage, retryUrl, retrySuccessHandler, retryErrorHandler) {
    var message = createOverlayMessage('error');
    var errorMsgElem = message.querySelector('.error__message');
    var tryAgain = message.querySelector('.error__button');
    errorMsgElem.textContent = errorMessage;

    tryAgain.addEventListener('click', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      getDataFromServer(retryUrl, retrySuccessHandler, retryErrorHandler);
    });

    return message;
  }

  function updateErrorMessage(message) {
    var overlay = document.querySelector('#overlayMessage');
    var errorMsgElem = overlay.querySelector('.error__message');
    errorMsgElem.textContent = message;
  }

  function getDataFromServer(url, onSuccess, onError) {
    var xhr = createXhr(url, 'GET', onSuccess, onError);
    xhr.send();
  }

  function sendDataToServer(url, data, onSuccess, onError) {
    var xhr = createXhr(url, 'POST', onSuccess, onError);
    xhr.send(data);
  }

  function createXhr(url, type, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open(type, url);

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    return xhr;
  }

  window.xhr = {
    getDataFromServer: getDataFromServer,
    sendDataToServer: sendDataToServer,
    createError: createError,
    updateErrorMessage: updateErrorMessage,
    createOverlayMessage: createOverlayMessage,
    closeOverlay: closeOverlay,
  };
})();
