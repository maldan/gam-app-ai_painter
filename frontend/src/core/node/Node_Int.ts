import { Node } from '@/core/Node';

export class Node_Int extends Node {
  constructor() {
    super();

    this.type = 'int';
    this.props['x:int'] = 0;
  }

  output(): string[] {
    return ['value:int'];
  }
}
