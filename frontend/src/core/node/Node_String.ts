import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_String extends Node {
  constructor() {
    super();

    this.type = 'string';
    // this.props['value:string'] = '';

    this.output = [new Pin('value:string')];
    this.initPins();
  }

  /* output(): string[] {
    return ['value:string'];
  }*/

  /*async execute(): Promise<any> {
    return this.props['value:string'];
  }*/
}
