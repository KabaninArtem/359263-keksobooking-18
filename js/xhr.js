'use strict';

(function () {
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
  };
})();
