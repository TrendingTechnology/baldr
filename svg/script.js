
function logElement() {
	element = document.querySelector('#layer3');
  console.log(element.style.visibility = 'hidden');
}

function loadSVG() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "Zeichnung.svg", true);
	xhr.onload = (e) => {
	  if (xhr.readyState === 4) {
	    if (xhr.status === 200) {
				document.getElementById("zeichnung")
					.appendChild(xhr.responseXML.documentElement);
				logElement();
	    } else {
	      console.error(xhr.statusText);
	    }
	  }
	};
	xhr.overrideMimeType("image/svg+xml");
	xhr.onerror = function (e) {
	  console.error(xhr.statusText);
	};
	xhr.send(null);
}

window.onload = onLoad;

function onLoad() {
	loadSVG();
}
