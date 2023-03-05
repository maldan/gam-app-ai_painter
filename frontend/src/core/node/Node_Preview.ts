import { Node } from '@/core/Node';

export class Node_Preview extends Node {
  constructor() {
    super();

    this.type = 'image';
    this.props['image:image'] = '';
  }

  input(): string[] {
    return ['image:image'];
  }

  output(): string[] {
    return ['image:image'];
  }

  public async execute() {
    await super.execute();
    this.props['image:image'] = this.cache['image'];
    return this.props['image:image'];
  }
}
