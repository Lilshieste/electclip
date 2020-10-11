const { NodeEventEmitter, clipboard } = require("electron");
const {EventEmitter } = require('events');

class ClipboardMonitor extends EventEmitter {
  constructor() {
    super();
    this.previous = null;
    this.timerId = null;
  }

  start() {
    this.timerId = setInterval(() => {
      const current = clipboard.readText();
      if(current !== this.previous) {
        this.emit('copied', current);
        this.previous = current;
      }}, 500);
  }

  stop() {
    if(this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

module.exports.ClipboardMonitor = ClipboardMonitor;