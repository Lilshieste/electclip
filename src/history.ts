import { promises as fs, existsSync } from 'fs';

export interface HistoryEntry {
  item: any,
};

export const saveHistory = (history: History, filename: string) => {
  const data = JSON.stringify(history.items);
  return fs.writeFile(filename, data, { encoding: 'utf-8' })
    .catch(console.log);
};

export const loadHistory = async (filename: string) => {
  if(existsSync(filename)) {
    const data = await fs.readFile(filename, { encoding: 'utf-8' });
    const items = JSON.parse(data);
  
    return new History(items);
  } else {
    return new History();
  }
};

export class History {
  private maxItems = 200;

  public items: HistoryEntry[];
  
  constructor(items: HistoryEntry[] = []) {
    this.items = items;
    this.prune();
  }

  prune() {
    this.items.splice(this.maxItems);
  }

  addItem(item: any) {
    const newItem = { item: item } as HistoryEntry;
    if(!this.items.length) {
      this.items.push(newItem);
    }
    else if(this.items[0].item !== item) {
      this.items.splice(0, 0, newItem);
      this.prune();
    }
  }

  popItemAt(index: number) {
    const value = this.items[index];
    this.items.splice(index, 1);

    return value;
  }
};