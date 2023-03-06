import type { Node } from '@/core/Node';
import { uid } from 'uid';

export class Connection {
  public id = '';
  public fromNode!: Node;
  public toNode!: Node;
  public fromId: string;
  public toId: string;
  public pinOutput: string;
  public pinInput: string;
  public pair: string;
  public type: string;

  constructor(fromNode: Node, toNode: Node, pair: string) {
    this.fromNode = fromNode;
    this.toNode = toNode;
    this.pinOutput = pair.split(':')[0];
    this.pinInput = pair.split(':')[1];
    this.id = 'conn_' + uid(8);
    this.fromId = fromNode.id;
    this.toId = toNode.id;
    this.pair = pair;

    const ff = fromNode.output.find((pin) => pin.name == this.pinOutput);
    if (ff) {
      this.type = ff.type;
    } else {
      this.type = 'unknown';
    }
  }
}
