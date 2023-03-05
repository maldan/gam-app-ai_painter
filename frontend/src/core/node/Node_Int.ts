import { Node } from '@/core/Node';

export class Node_Int extends Node {
  constructor() {
    super();

    this.type = 'int';
    this.props['value:int'] = 0;
  }

  output(): string[] {
    return ['value:int'];
  }

  async execute(): Promise<any> {
    return Number(this.props['value:int']);
  }
}
