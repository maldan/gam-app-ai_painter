import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_Float extends Node {
  constructor() {
    super();

    this.type = 'float';
    this.output = [new Pin('value:float')];
    this.initPins();
  }

  /*output(): string[] {
    return ['value:float'];
  }*/

  /*async execute(): Promise<any> {
    return Number(this.props['value:float']);
  }*/
}
