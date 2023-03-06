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

  public async execute() {
    await super.execute();

    this.isProcessing = true;
    const apiStore = useAPIStore();
    const image = await apiStore.txt2img({
      seed: this.inputValue['seed'],
      prompt: this.inputValue['prompt'],
      negativePrompt: this.inputValue['negativePrompt'],
      cfg: this.inputValue['cfg'],
      steps: this.inputValue['steps'],
      width: this.inputValue['size'].x,
      height: this.inputValue['size'].y,
    });
    this.outputValue['image'] = image;
    this.isProcessing = false;

    return image;
  }
}
