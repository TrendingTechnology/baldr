const {remote} = require('electron');
const {Menu, MenuItem} = remote;
const child_process = require('child_process');

function update() {
  var worker_process = child_process.fork("modules/library-update/command.js");
}

const contextMenu = new Menu();
contextMenu.append(new MenuItem(
  {
    label: 'Akualisieren der Liedersammlung',
    accelerator: 'CmdOrCtrl+u',
    click: update
  }
));

contextMenu.append(new MenuItem(
  {
    label: 'Akualisieren der Liedersammlung (komplett)',
    click: library.updateForce
  }
));

window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  contextMenu.popup(remote.getCurrentWindow());
}, false);
