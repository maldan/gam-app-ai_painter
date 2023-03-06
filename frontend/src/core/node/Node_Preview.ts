import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_Preview extends Node {
  constructor() {
    super();

    this.type = 'image';
    // this.props['image:image'] = '';

    this.input = [new Pin('image:image')];
    this.output = [new Pin('image:image')];
    this.initPins();
  }

  /*input(): string[] {
    return ['image:image'];
  }

  output(): string[] {
    return ['image:image'];
  }*/

  /*public async execute() {
    await super.execute();
    this.props['image:image'] = this.cache['image'];
    return this.props['image:image'];
  }*/
}
