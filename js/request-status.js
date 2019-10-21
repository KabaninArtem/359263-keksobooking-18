'use strict';

(function () {
  var isEscEvent = window.util.isEscEvent;
  var getDataFromServer = window.xhr.getDataFromServer;

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

  window.requestStatus = {
    createError: createError,
    updateErrorMessage: updateErrorMessage,
    createOverlayMessage: createOverlayMessage,
    closeOverlay: closeOverlay,
  }
})();
