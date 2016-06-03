const {remote} = require('electron');
const {Menu, MenuItem} = remote;

const contextMenu = new Menu();
contextMenu.append(new MenuItem(
  {
    label: 'Akualisieren der Liedersammlung',
    accelerator: 'CmdOrCtrl+u',
    click: library.update
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
