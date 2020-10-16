export class History {
  public items: any[];
  
  constructor() {
    this.items = [];
  }

  addItem(item: any) {
    this.items.splice(0, 0, item);
  }
};