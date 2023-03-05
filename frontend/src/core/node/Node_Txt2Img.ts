import { Node } from '@/core/Node';

export class Node_Txt2Img extends Node {
  constructor() {
    super();

    this.type = 'function';
    // this.props['v:string'] = '';
  }

  input(): string[] {
    return ['seed:int', 'prompt:string', 'negativePrompt:string', 'cfg:float', 'steps:int', 'size:vector2'];
  }

  output(): string[] {
    return ['image:image'];
  }

  public async execute() {
    // console.log('gaaas');
  }
}
