import { Node } from '@/core/Node';
import { useAPIStore } from '@/store/api';
import { Pin } from '@/core/Pin';

export class Node_Txt2Img extends Node {
  constructor() {
    super();

    this.type = 'function';
    this.input = ['seed:int', 'prompt:string', 'negativePrompt:string', 'cfg:float', 'steps:int', 'size:vector2'].map(
      (x) => new Pin(x),
    );
    this.output = ['image:image'].map((x) => new Pin(x));

    this.initPins();
  }

  /*input(): string[] {
    return ['seed:int', 'prompt:string', 'negativePrompt:string', 'cfg:float', 'steps:int', 'size:vector2'];
  }

  output(): string[] {
    return ['image:image'];
  }*/

  public async execute() {
    await super.execute();

    /*this.isProcessing = true;
    const apiStore = useAPIStore();
    const image = await apiStore.txt2img({
      prompt: this.cache['prompt'],
      negativePrompt: this.cache['negativePrompt'],
      cfg: this.cache['cfg'],
      steps: this.cache['steps'],
      width: this.cache['size'].x,
      height: this.cache['size'].y,
    });
    this.isProcessing = false;

    return image;*/
  }
}
