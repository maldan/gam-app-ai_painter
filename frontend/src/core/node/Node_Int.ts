import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_Int extends Node {
  constructor() {
    super();

    this.type = 'int';
    // this.props['value:int'] = 0;
    this.output = [new Pin('value:int')];
    this.initPins();
  }

  /*output(): string[] {
    return ['value:int'];
  }*/

  async execute(): Promise<any> {
    // return Number(this.props['value:int']);
  }
}
