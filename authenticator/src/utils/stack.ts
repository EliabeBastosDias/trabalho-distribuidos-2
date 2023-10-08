export class Stack<T> {
  private items: T[];

  constructor(length: number) {
    this.items = new Array<T>(length);
  }

  public get() {
    return this.items;
  }

  public add(item: any) {
    this.items.push(item);
  }

  public isEmpty() {
    return this.items.length === 0;
  }

  public length() {
    return this.items.length;
  }

  public stack(item: T) {
    this.items.push(item);
  }

  public unstack() {
    if (!this.isEmpty()) {
      return this.items.pop();
    } else {
      console.log("A pilha está vazia. Não é possível desempilhar.");
    }
  }

  public top() {
    if (!this.isEmpty()) {
      return this.items[this.items.length - 1];
    } else {
      console.log("A pilha está vazia. Não há topo.");
    }
  }
}
