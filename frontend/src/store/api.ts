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
    async txt2img(args: any): Promise<string> {
      return (await Axios.post(`${API_URL}/sd/txt2img`, args)).data;
    },
    async img2img(args: any): Promise<string> {
      return (await Axios.post(`${API_URL}/sd/img2img`, args)).data;
    },
    async uploadImage(image: string): Promise<string> {
      return (
        await Axios.post(`${API_URL}/sd/uploadImage`, {
          image,
        })
      ).data;
    },
  },
});
