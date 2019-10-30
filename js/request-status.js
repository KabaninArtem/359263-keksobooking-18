'use strict';

(function () {
  var isEscEvent = window.util.isEscEvent;

  function createOverlayMessage(template) {
    var templateFragment = template.content.cloneNode(true);
    var templateMessage = templateFragment.querySelector('div');

    function onOverlayEscPress(evt) {
      isEscEvent(evt, closeOverlay);
    }

    function closeOverlay() {
      document.body.removeChild(templateMessage);
      document.removeEventListener('keydown', onOverlayEscPress);
    }

    document.addEventListener('keydown', onOverlayEscPress);
    templateMessage.addEventListener('click', closeOverlay);
    return templateMessage;
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
