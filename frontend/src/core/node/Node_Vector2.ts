import { Node } from '@/core/Node';
import { Pin } from '@/core/Pin';

export class Node_Vector2 extends Node {
  constructor() {
    super();

    this.type = 'vector2';
    /*this.props['x:float'] = 0;
    this.props['y:float'] = 0;*/
    this.output = [new Pin('value:vector2')];
    this.initPins();
  }

  /*output(): string[] {
    return ['value:vector2'];
  }*/

  async execute(): Promise<any> {
    return { x: Number(this.outputValue['value'].x), y: Number(this.outputValue['value'].y) };
  }
}
