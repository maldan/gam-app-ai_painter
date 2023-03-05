export class Node {
  public id = '';
  public type = '';
  public x = 0;
  public y = 0;
  public props = {} as Record<string, any>;

  public input(): string[] {
    return [];
  }

  public output(): string[] {
    return [];
  }

  public static typeToColor(type: string): string {
    if (type == 'int') return '#992b96';
    if (type == 'vector2') return 'rgb(98,42,152)';
    if (type == 'image') return '#98462a';
    return '#ffffff';
  }
}
