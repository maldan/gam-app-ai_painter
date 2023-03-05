import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface IMainStore {
  x: number;
}

export const useMainStore = defineStore({
  id: 'main',
  state: () =>
    ({
      x: 1,
    } as IMainStore),
  actions: {},
});
