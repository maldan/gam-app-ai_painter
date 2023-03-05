import { Node } from '@/core/Node';

export class Node_BlendImages extends Node {
  constructor() {
    super();

    this.type = 'function';
    // this.props['v:string'] = '';
  }

  input(): string[] {
    return ['image1:image', 'image2:image'];
  }

  output(): string[] {
    return ['combined:image'];
  }

  public async execute() {
    await super.execute();
    return 5;
  }
}
