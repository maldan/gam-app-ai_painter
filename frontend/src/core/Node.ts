import { uid } from 'uid';
import type { Pin } from '@/core/Pin';

export class Node {
  public id = '';
  public type = '';
  public className = '';
  public x = 0;
  public y = 0;
  // public props = {} as Record<string, any>;
  public outputPinPosition = {} as Record<string, { x: number; y: number }>;
  public inputPinPosition = {} as Record<string, { x: number; y: number }>;
  public isProcessing = false;
  // public cache = {} as Record<string, any>;
  public isInputPinConnected = {} as Record<string, boolean>;
  public isOutputPinConnected = {} as Record<string, boolean>;
  public input: Pin[] = [];
  public output: Pin[] = [];
  public inputValue: any = {};
  public outputValue: any = {};

  constructor() {
    this.on('pinConnected', (type: string, pinId: string) => {
      if (type === 'input') this.isInputPinConnected[pinId] = true;
      if (type === 'output') this.isOutputPinConnected[pinId] = true;
    });
    this.on('pinDisconnected', (type: string, pinId: string) => {
      if (type === 'input') this.isInputPinConnected[pinId] = false;
      if (type === 'output') this.isOutputPinConnected[pinId] = false;
    });
  }

  private _eventList: any = {};

  public getInputValue!: (pinInput: string) => Promise<any>;

  public initPins() {
    this.input.forEach((x) => {
      this.inputValue[x.name] = '';
    });
    this.output.forEach((x) => {
      this.outputValue[x.name] = '';
    });
  }

  /*public input(): Pin[] {
    return [];
  }

  public output(): Pin[] {
    return [];
  }*/

  public async execute(): Promise<any> {
    this.isProcessing = true;
    // const input = this.input();
    for (let i = 0; i < this.input.length; i++) {
      this.inputValue[this.input[i].name] = await this.getInputValue(this.input[i].name);
      // this.cache[input[i].name] = await this.getInputValue(input[i].name);
    }
    this.isProcessing = false;
  }

  public clone(): Node {
    const n = new Node();
    n.id = uid(8);
    n.type = this.type;
    n.className = this.className;
    n.inputValue = { ...this.inputValue };
    n.outputValue = { ...this.outputValue };
    return n;
  }

  public on(evt: string, fn: (...data: any[]) => void) {
    if (!this._eventList[evt]) {
      this._eventList[evt] = [];
    }
    this._eventList[evt].push(fn);
  }

  public emit(evt: string, ...data: any[]) {
    this._eventList[evt]?.forEach((fn: any) => {
      fn(...data);
    });
  }
}
