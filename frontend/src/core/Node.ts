export class Node {
  public id = '';
  public type = '';
  public x = 0;
  public y = 0;
  public props = {} as Record<string, any>;
  public outputPinPosition = {} as Record<string, { x: number; y: number }>;
  public inputPinPosition = {} as Record<string, { x: number; y: number }>;

  public input(): string[] {
    return [];
  }

  public output(): string[] {
    return [];
  }

  public async execute() {}

  public static typeToColor(type: string): string {
    if (type == 'int') return '#992b96';
    if (type == 'float' || type == 'vector2') return 'rgb(98,42,152)';
    if (type == 'image') return '#98462a';
    if (type == 'string') return '#50982a';
    if (type == 'function') return '#1671c7';
    return '#ffffff';
  }
}
