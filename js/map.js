'use strict';

(function () {
  var map = document.querySelector('.map');

  window.map = {
    map: map,
    enable: function () {
      map.classList.remove('map--faded');
    }
  };
})();
