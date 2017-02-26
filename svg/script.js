
function logElement() {
  element = document.querySelector('#layer3');
  console.log(element.style.visibility = 'hidden');
}

function loadSVGinID(path, targetID) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.onload = (e) => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        document
          .getElementById(targetID)
          .appendChild(xhr.responseXML.documentElement);
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.overrideMimeType('image/svg+xml');
  xhr.onerror = (e) => {
    console.error(xhr.statusText);
  };
  xhr.send(null);
}

function onLoad() {
  loadSVGinID('Zeichnung.svg', 'zeichnung');
}

window.onload = onLoad;
