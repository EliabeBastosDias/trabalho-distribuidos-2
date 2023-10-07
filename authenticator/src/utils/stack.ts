export class Stack<T> {
    private items: T[];

    constructor(length: number) {
      this.items = new Array<T>(length);
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    length() {
      return this.items.length;
    }
  
    stack(item: T) {
      this.items.push(item);
    }
  
    unstack() {
      if (!this.isEmpty()) {
        return this.items.pop();
      } else {
        console.log("A pilha está vazia. Não é possível desempilhar.");
      }
    }
  
    top() {
      if (!this.isEmpty()) {
        return this.items[this.items.length - 1];
      } else {
        console.log("A pilha está vazia. Não há topo.");
      }
    }
  }