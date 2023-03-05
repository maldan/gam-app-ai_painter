import { Node } from '@/core/Node';

export class Node_Image extends Node {
  constructor() {
    super();

    this.type = 'image';
    this.props['image:image'] = '';
    // this.props['y:float'] = 0;
  }

  output(): string[] {
    return ['image:image'];
  }

  public async execute() {
    return this.props['image:image'];
  }
}
