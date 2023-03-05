import { Node } from '@/core/Node';

export class Node_String extends Node {
  constructor() {
    super();

    this.type = 'string';
    this.props['value:string'] = '';
  }

  output(): string[] {
    return ['value:string'];
  }
}
