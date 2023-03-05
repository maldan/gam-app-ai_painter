import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface IAPIStore {
  x: number;
}

export const useAPIStore = defineStore({
  id: 'api',
  state: () =>
    ({
      x: 1,
    } as IAPIStore),
  actions: {
    async txt2img(args: any) {
      await Axios.post(`${API_URL}/sd/txt2img`, args);
    },
  },
});
