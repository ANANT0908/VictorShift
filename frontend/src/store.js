// store.js

import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true, markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' } }, get().edges),
    });
    // Auto-insert tag when connecting Input → Text node
    const targetNode = get().nodes.find((n) => n.id === connection.target);
    const sourceNode = get().nodes.find((n) => n.id === connection.source);
    if (targetNode?.type === 'text' && sourceNode?.type === 'customInput') {
      const name = sourceNode.data?.inputName || sourceNode.id.replace('customInput-', 'input_');
      const tag = `{{${name}.text}}`;
      const curr = targetNode.data?.text || '';
      if (!curr.includes(tag)) {
        set({
          nodes: get().nodes.map((n) => {
            if (n.id === connection.target) {
              return { ...n, data: { ...n.data, text: curr + (curr ? '\n' : '') + tag } };
            }
            return n;
          }),
        });
      }
    }
  },
  getInputNodes: () => {
    return get().nodes.filter((n) => n.type === 'customInput');
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },
}));
