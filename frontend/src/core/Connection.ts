import type { Node } from '@/core/Node';

export class Connection {
  public id = '';
  public fromNode!: Node;
  public toNode!: Node;
  public outputId: string;
  public inputId: string;
  public type: string;

  constructor(fromNode: Node, toNode: Node, pair: string) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.outputId = pair.split(':')[0];
    this.inputId = pair.split(':')[1];
    this.id = fromNode.id + '_' + toNode.id + '_' + pair;

    const ff = fromNode.output().find((x) => x.split(':')[0] == this.outputId);
    if (ff) {
      this.type = ff.split(':')[1];
    } else {
      this.type = 'unknown';
    }
  }
}
