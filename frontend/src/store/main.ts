import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';

export interface IMainStore {
  nodeClassList: string[];
}

export const useMainStore = defineStore({
  id: 'main',
  state: () =>
    ({
      nodeClassList: ['Node_Int', 'Node_Float'],
    } as IMainStore),
  actions: {},
});
