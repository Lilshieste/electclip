const { EventEmitter } = require('events');

export class ClipboardMonitor extends EventEmitter {
  constructor(clipboard: any) {
    super();
    this.previous = null;
    this.timerId = null;
    this.clipboard = clipboard;
  }

  start() {
    this.timerId = setInterval(() => this.checkForNewClipboardEntry(), 500);
  }

  stop() {
    if(this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  checkForNewClipboardEntry() {
    const current = this.clipboard.readText();
    if(current !== this.previous) {
      this.emit('copied', current);
      this.previous = current;
    };
  }
}