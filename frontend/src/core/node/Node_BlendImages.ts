import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_BlendImages extends Node {
  constructor() {
    super();

    this.type = 'function';
    // this.props['v:string'] = '';
    this.input = [new Pin('image1:image'), new Pin('image2:image')];
    this.output = [new Pin('combined:image')];
    this.initPins();
  }

  /*input(): string[] {
    return ['image1:image', 'image2:image'];
  }

  output(): string[] {
    return ['combined:image'];
  }*/

  public async execute() {
    await super.execute();
    return 5;
  }
}
