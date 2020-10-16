module.exports.History = class {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.splice(0, 0, item);
  }
};