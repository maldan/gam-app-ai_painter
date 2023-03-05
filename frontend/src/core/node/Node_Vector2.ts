import { Node } from '@/core/Node';

export class Node_Vector2 extends Node {
  constructor() {
    super();

    this.type = 'vector2';
    this.props['x:float'] = 0;
    this.props['y:float'] = 0;
  }

  output(): string[] {
    return ['value:vector2'];
  }

  async execute(): Promise<any> {
    return { x: Number(this.props['x:float']), y: Number(this.props['y:float']) };
  }
}
