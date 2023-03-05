import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface IViewStore {
  x: number;
  y: number;
  zoom: number;
  cursor: { x: number; y: number };
}

export const useViewStore = defineStore({
  id: 'view',
  state: () =>
    ({
      x: 0,
      y: 0,
      zoom: 1,
      cursor: { x: 0, y: 0 },
    } as IViewStore),
  actions: {
    moveCursor(x: number, y: number) {
      this.cursor = { x, y };
    },
    move(x: number, y: number) {
      this.x = x;
      this.y = y;
    },
  },
});
