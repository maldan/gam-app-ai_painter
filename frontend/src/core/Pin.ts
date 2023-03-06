export class Pin {
  public name = '';
  public type = '';

  constructor(p: string) {
    this.name = p.split(':')[0];
    this.type = p.split(':')[1];
  }
}
