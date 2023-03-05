import { uid } from 'uid';

export class Node {
  public id = '';
  public type = '';
  public className = '';
  public x = 0;
  public y = 0;
  public props = {} as Record<string, any>;
  public outputPinPosition = {} as Record<string, { x: number; y: number }>;
  public inputPinPosition = {} as Record<string, { x: number; y: number }>;
  public isProcessing = false;
  public cache = {} as Record<string, any>;

  public getInputValue!: (pinInput: string) => Promise<any>;

  public input(): string[] {
    return [];
  }

  public output(): string[] {
    return [];
  }

  public async execute(): Promise<any> {
    this.isProcessing = true;
    const input = this.input();
    for (let i = 0; i < input.length; i++) {
      this.cache[input[i].split(':')[0]] = await this.getInputValue(input[i].split(':')[0]);
    }
    this.isProcessing = false;
  }

  public clone(): Node {
    const n = new Node();
    n.id = uid(8);
    n.type = this.type;
    n.className = this.className;
    n.props = { ...this.props };
    return n;
  }

  public static typeToColor(type: string): string {
    if (type == 'int') return '#992b96';
    if (type == 'float' || type == 'vector2') return 'rgb(98,42,152)';
    if (type == 'image') return '#98462a';
    if (type == 'string') return '#50982a';
    if (type == 'function') return '#1671c7';
    return '#ffffff';
  }
}
