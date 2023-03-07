import { uid } from 'uid';
import type { Pin } from '@/core/Pin';

export class Node {
  public id = '';
  public type = '';
  public className = '';
  public x = 0;
  public y = 0;
  public outputPinPosition = {} as Record<string, { x: number; y: number }>;
  public inputPinPosition = {} as Record<string, { x: number; y: number }>;
  public isProcessing = false;
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
      if (x.type == 'int') this.inputValue[x.name] = 0;
      if (x.type == 'float') this.inputValue[x.name] = 0;
      if (x.type == 'vector2') this.inputValue[x.name] = { x: 0, y: 0 };
    });
    this.output.forEach((x) => {
      this.outputValue[x.name] = '';
      if (x.type == 'int') this.outputValue[x.name] = 0;
      if (x.type == 'float') this.outputValue[x.name] = 0;
      if (x.type == 'vector2') this.outputValue[x.name] = { x: 0, y: 0 };
    });
  }

  public async execute(): Promise<any> {
    this.isProcessing = true;
    // const input = this.input();
    for (let i = 0; i < this.input.length; i++) {
      if (this.isInputPinConnected[this.input[i].name]) {
        this.inputValue[this.input[i].name] = await this.getInputValue(this.input[i].name);
      }
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
