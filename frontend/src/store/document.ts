import { defineStore } from 'pinia';
import Axios from 'axios';
import { API_URL } from '@/const';
import type { Node } from '@/core/Node';
import { Connection } from '@/core/Connection';
import { uid } from 'uid';
import { Config } from '@/core/Config';

export interface IMainStore {
  name: string;
  nodeList: Node[];
  connectionList: Connection[];
  dragFromNodeId: string;
  dragToNodeId: string;
  dragFromPin: string;
  dragToPin: string;
}

export const useDocumentStore = defineStore({
  id: 'document',
  state: () =>
    ({
      name: 'test',
      nodeList: [],
      connectionList: [],
      dragFromNodeId: '',
      dragToNodeId: '',
      dragFromPin: '',
      dragToPin: '',
    } as IMainStore),
  actions: {
    createNode(className: string, args: any = {}): Node {
      const cls = Config.nameToClass(className);
      const node: Node = new cls();
      node.id = args.id ?? 'node_' + uid(8);
      node.x = args.x ?? Math.random() * 300;
      node.y = args.y ?? Math.random() * 300;
      node.className = className;
      node.props = args.props ?? node.props;

      (node as Node).getInputValue = async (pinInput: string): Promise<any> => {
        const conn = this.connectionList.find((x) => {
          return x.toNode.id == node.id && x.pinInput == pinInput;
        });
        if (!conn) return;
        return await conn.fromNode.execute();
      };

      this.nodeList.push(node);
      return node;
    },
    deleteNode(node: any) {
      const nodeId = node;

      this.nodeList = this.nodeList.filter((x) => x.id !== nodeId);
      this.connectionList = this.connectionList.filter((x) => {
        return !(x.fromNode.id === nodeId || x.toNode.id === nodeId);
      });
    },
    connectById(fromNodeId: string, toNodeId: string, pair: string) {
      if (fromNodeId === toNodeId) return;
      const fromNode = this.nodeList.find((x) => x.id === fromNodeId);
      const toNode = this.nodeList.find((x) => x.id === toNodeId);
      if (!fromNode || !toNode) return;
      this.connect(fromNode, toNode, pair);
    },
    unconnect(fromNode: Node, toNode: Node, pair: string) {
      this.connectionList = this.connectionList.filter((x) => {
        return !(x.fromNode.id === fromNode.id && x.toNode.id === toNode.id && x.pair === pair);
      });
    },
    connect(fromNode: Node, toNode: Node, pair: string) {
      if (fromNode === toNode) return;

      // Check if exists
      if (
        this.connectionList.find((x) => {
          return x.fromNode.id === fromNode.id && x.toNode.id === toNode.id && x.pair === pair;
        })
      )
        return;

      this.connectionList.push(new Connection(fromNode, toNode, pair));
    },
    async save() {
      await Axios.post(`${API_URL}/document`, {
        name: this.name,
        nodeList: this.nodeList,
        connectionList: this.connectionList,
      });
    },
    async load() {
      const doc = (await Axios.get(`${API_URL}/document?name=${this.name}`)).data;
      for (let i = 0; i < doc.nodeList.length; i++) {
        this.createNode(doc.nodeList[i].className, doc.nodeList[i]);
      }
      for (let i = 0; i < doc.connectionList.length; i++) {
        const fromNode = this.nodeList.find((x) => x.id === doc.connectionList[i].fromId);
        const toNode = this.nodeList.find((x) => x.id === doc.connectionList[i].toId);
        if (!fromNode || !toNode) continue;

        this.connect(fromNode, toNode, doc.connectionList[i].pinOutput + ':' + doc.connectionList[i].pinInput);
        // console.log(doc.connectionList[i]);
        // this.createNode(doc.nodeList[i].className, doc.nodeList[i]);
      }
    },
  },
});
