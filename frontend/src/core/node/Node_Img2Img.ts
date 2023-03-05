import { Node } from '@/core/Node';
import { useAPIStore } from '@/store/api';

export class Node_Img2Img extends Node {
  constructor() {
    super();

    this.type = 'function';
  }

  input(): string[] {
    return [
      'image:image',
      'seed:int',
      'prompt:string',
      'negativePrompt:string',
      'cfg:float',
      'steps:int',
      'size:vector2',
      'denoisingStrength:float',
    ];
  }

  output(): string[] {
    return ['image:image'];
  }

  public async execute() {
    await super.execute();

    this.isProcessing = true;
    const apiStore = useAPIStore();
    const image = await apiStore.img2img({
      initImage: this.cache['image'],
      prompt: this.cache['prompt'],
      negativePrompt: this.cache['negativePrompt'],
      cfg: this.cache['cfg'],
      steps: this.cache['steps'],
      width: this.cache['size'].x,
      height: this.cache['size'].y,
      denoisingStrength: this.cache['denoisingStrength'],
    });
    this.isProcessing = false;

    return image;
  }
}
