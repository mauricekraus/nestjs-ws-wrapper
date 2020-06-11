export interface IKeyedCollection<T> {
  add(key: string, value: T): void;
  containsKey(key: string): boolean;

  item(key: string): T;
  keys(): string[];
  remove(key: string): T;
  values(): T[];
}

export class KeyedCollection<T> implements IKeyedCollection<T> {
  private items: { [index: string]: T } = {};

  public containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public add(key: string, value: T) {
    this.items[key] = value;
  }

  public remove(key: string): T {
    const val = this.items[key];
    delete this.items[key];

    return val;
  }

  public item(key: string): T {
    return this.items[key];
  }

  public keys(): string[] {
    return Object.keys(this.items);
  }

  public values(): T[] {
    return Object.values(this.items);
  }
}
