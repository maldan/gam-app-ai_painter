import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_Image extends Node {
  constructor() {
    super();

    this.type = 'image';
    // this.props['image:image'] = '';
    // this.props['y:float'] = 0;
    this.output = ['image:image'].map((x) => new Pin(x));
    this.initPins();
  }

  /*  output(): string[] {
    return ['image:image'];
  }*/

  /* public async execute() {
    return this.props['image:image'];
  }*/
}
