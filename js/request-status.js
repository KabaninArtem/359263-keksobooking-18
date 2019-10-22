'use strict';

(function () {
  var isEscEvent = window.util.isEscEvent;

  function getOverlayTemplate(status) {
    var template = document.querySelector('#' + status).content.cloneNode(true);
    return template.querySelector('.' + status);
  }

  function createOverlayMessage(status) {
    var template = getOverlayTemplate(status);

    function onOverlayEscPress(evt) {
      isEscEvent(evt, closeOverlay);
    }

    function closeOverlay() {
      document.body.removeChild(template);
      document.removeEventListener('keydown', onOverlayEscPress);
    }

    document.addEventListener('keydown', onOverlayEscPress);
    template.addEventListener('click', closeOverlay);
    return template;
  }

  function createError(overlayELem, errorMessage, serverRequest) {
    var tryAgain = overlayELem.querySelector('.error__button');
    updateErrorMessage(overlayELem, errorMessage);
    tryAgain.addEventListener('click', function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      serverRequest();
    });

    return overlayELem;
  }

  function updateErrorMessage(errorElem, message) {
    var errorMsgElem = errorElem.querySelector('.error__message');
    errorMsgElem.textContent = message;
  }

  window.requestStatus = {
    createError: createError,
    updateErrorMessage: updateErrorMessage,
    createOverlayMessage: createOverlayMessage,
  };
})();
