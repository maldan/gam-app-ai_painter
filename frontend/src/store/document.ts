import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import type { Node } from '@/core/Node';
import { Connection } from '@/core/Connection';

export interface IMainStore {
  nodeList: Node[];
  connectionList: Connection[];
}

export const useDocumentStore = defineStore({
  id: 'document',
  state: () =>
    ({
      nodeList: [],
      connectionList: [],
    } as IMainStore),
  actions: {
    createNode(type: any): Node {
      const node = new type();
      node.id = Math.random() + '';
      node.x = Math.random() * 300;
      node.y = Math.random() * 300;
      this.nodeList.push(node);
      return node;
    },
    connect(fromNode: Node, toNode: Node, pair: string) {
      this.connectionList.push(new Connection(fromNode, toNode, pair));
    },
  },
});
