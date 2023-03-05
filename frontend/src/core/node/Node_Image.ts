import { Node } from '@/core/Node';

export class Node_Image extends Node {
  constructor() {
    super();

    this.type = 'image';
    this.props['x:float'] = 0;
    this.props['y:float'] = 0;
  }

  output(): string[] {
    return ['value:image'];
  }
}
