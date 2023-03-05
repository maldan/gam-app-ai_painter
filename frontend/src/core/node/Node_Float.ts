import { Node } from '@/core/Node';

export class Node_Float extends Node {
  constructor() {
    super();

    this.type = 'float';
    this.props['x:float'] = 0;
  }

  output(): string[] {
    return ['value:float'];
  }
}
