import { Node } from '@/core/Node';

export class Node_Float extends Node {
  constructor() {
    super();

    this.type = 'float';
    this.props['value:float'] = 0;
  }

  output(): string[] {
    return ['value:float'];
  }

  async execute(): Promise<any> {
    return Number(this.props['value:float']);
  }
}
