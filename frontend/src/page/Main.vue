<template>
  <div
    :class="$style.main"
    :style="{
      backgroundPositionX: viewStore.x + 'px',
      backgroundPositionY: viewStore.y + 'px',
      backgroundSize: `${32 * viewStore.zoom}px ${32 * viewStore.zoom}px`,
    }"
  >
    <div ref="viewRef" :class="$style.view" :style="{ transform: viewTransform() }">
      <CNode
        @mousedown="mouseDownNode($event, n)"
        v-for="n in documentStore.nodeList"
        :key="n.id"
        :is-selected="selectedNode?.id === n.id"
        :node="n"
        :style="{ zIndex: selectedNode?.id === n.id ? 2 : 1 }"
      />
      <div
        :class="$style.line"
        v-for="x in documentStore.connectionList"
        :key="x.id"
        :style="calculateLine(x.fromNode, x.toNode, x.pinOutput, x.pinInput, x.type)"
      ></div>

      <NodePicker v-if="viewStore.nodePicker.isShow" :x="viewStore.nodePicker.x" :y="viewStore.nodePicker.y" />
    </div>

    <!--    <div style="display: flex; flex-direction: column">
      <div>{{ ~~viewStore.x }} {{ ~~viewStore.y }}</div>
      <div>{{ viewStore.cursor }}</div>
    </div>-->
  </div>
</template>

<script setup lang="ts">
import CNode from '@/component/CNode.vue';
import { onMounted, ref } from 'vue';
import type { Node } from '@/core/Node';
import { useViewStore } from '@/store/view';
import { useDocumentStore } from '@/store/document';
import NodePicker from '@/component/NodePicker.vue';
import { Config } from '@/core/Config';

// Stores
const documentStore = useDocumentStore();
const viewStore = useViewStore();

// Vars
const selectedNode = ref<any>(null);
const viewRef = ref<HTMLDivElement>();

// Hooks
onMounted(() => {
  let isDrag = false;
  let startDrag = { x: 0, y: 0 };
  let startTranslate = { x: 0, y: 0 };

  document.addEventListener('click', (e: MouseEvent) => {
    viewStore.toggleNodePicker(false);
  });

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button === 0) {
      selectNode(null);
    }
  });

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button == 1) {
      isDrag = true;
      startDrag = { x: e.pageX, y: e.pageY };
      startTranslate = { x: viewStore.x, y: viewStore.y };
    }
  });
  document.addEventListener('mouseup', (e: MouseEvent) => {
    if (e.button == 1) {
      isDrag = false;
    }
  });
  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (isDrag) {
      let delta = { x: e.pageX - startDrag.x, y: e.pageY - startDrag.y };

      viewStore.move(startTranslate.x + delta.x, startTranslate.y + delta.y);
    }
    const view = viewRef.value?.getBoundingClientRect();
    if (!view) return;
    viewStore.moveCursor((e.pageX - view.x) / viewStore.zoom, (e.pageY - view.y) / viewStore.zoom);
  });
  document.addEventListener('wheel', (e: WheelEvent) => {
    const oldZoom = viewStore.zoom;

    if (e.deltaY > 0) viewStore.zoom -= 0.1;
    if (e.deltaY < 0) viewStore.zoom += 0.1;
    if (viewStore.zoom < 0.3) viewStore.zoom = 0.3;
    if (viewStore.zoom > 3) viewStore.zoom = 3;

    const offsetX = viewStore.cursor.x * viewStore.zoom - viewStore.cursor.x * oldZoom;
    const offsetY = viewStore.cursor.y * viewStore.zoom - viewStore.cursor.y * oldZoom;

    if (e.deltaY < 0) {
      viewStore.x -= offsetX;
      viewStore.y -= offsetY;
    } else {
      viewStore.x -= offsetX;
      viewStore.y -= offsetY;
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
      e.preventDefault();
      documentStore.save();
    }
    if (e.key.toLowerCase() === 'c' && e.ctrlKey && selectedNode.value) {
      e.preventDefault();
      documentStore.buffer.push(selectedNode.value.clone());
    }
    if (e.key.toLowerCase() === 'v' && e.ctrlKey && documentStore.buffer.length) {
      e.preventDefault();
      for (let i = 0; i < documentStore.buffer.length; i++) {
        const node = documentStore.createNode(documentStore.buffer[i].className, documentStore.buffer[i]);
        node.x = viewStore.cursor.x;
        node.y = viewStore.cursor.y;
      }
      documentStore.buffer.length = 0;
    }
    if (e.key.toLowerCase() === 'a' && e.shiftKey) {
      e.preventDefault();
      viewStore.toggleNodePicker(true);
    }
    if (e.key.toLowerCase() === 'delete' && selectedNode.value) {
      e.preventDefault();
      documentStore.deleteNode(selectedNode.value.id);
    }
  });

  /*const n1 = documentStore.createNode('Node_Int');
  const n2 = documentStore.createNode('Node_String');
  const n3 = documentStore.createNode('Node_String');
  const n4 = documentStore.createNode('Node_Float');
  const n5 = documentStore.createNode('Node_Int');
  const n6 = documentStore.createNode('Node_Vector2');

  const n10 = documentStore.createNode('Node_Txt2Img');
  const n11 = documentStore.createNode('Node_Image');
  const n20 = documentStore.createNode('Node_BlendImages');

  documentStore.connect(n1, n10, 'value:seed');
  documentStore.connect(n2, n10, 'value:prompt');
  documentStore.connect(n3, n10, 'value:negativePrompt');
  documentStore.connect(n4, n10, 'value:cfg');
  documentStore.connect(n5, n10, 'value:steps');
  documentStore.connect(n6, n10, 'value:size');

  documentStore.connect(n10, n20, 'image:image1');
  documentStore.connect(n11, n20, 'image:image2');*/

  // documentStore.save();
  documentStore.load();
});

// Methods
function selectNode(node: any) {
  selectedNode.value = node;
}

function viewTransform() {
  let out = ``;
  out += `translateX(${viewStore.x}px) `;
  out += `translateY(${viewStore.y}px) `;
  out += `scale(${viewStore.zoom}) `;
  return out;
}

function calculateLine(fromNode: Node, toNode: Node, outputId: string, inputId: string, type: string) {
  let fx = fromNode.outputPinPosition[outputId]?.x || 0;
  let fy = fromNode.outputPinPosition[outputId]?.y || 0;
  let tx = toNode.inputPinPosition[inputId]?.x || 0;
  let ty = toNode.inputPinPosition[inputId]?.y || 0;
  let left = fx;
  let top = fy;
  let width = tx - fx;
  let height = ty - fy;
  let typeColor = Config.typeToColor(type);
  let borderTop = `2px dashed ${typeColor}`;
  let borderRight = `2px dashed ${typeColor}`;
  let borderLeft = `2px dashed ${typeColor}`;
  let borderBottom = `2px dashed ${typeColor}`;

  if (ty > fy) {
    borderBottom = '';
  } else {
    top = ty;
    height = fy - ty;
    borderTop = '';
  }
  if (tx > fx) {
    borderLeft = '';
  } else {
    left = tx;
    width = fx - tx;
    borderRight = '';
  }

  return {
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px',
    borderTop,
    borderRight,
    borderLeft,
    borderBottom,
  };
}

function mouseDownNode(e: MouseEvent, node: Node) {
  if (e.button === 0) {
    e.stopPropagation();
    selectNode(node);
  }
}
</script>

<style module lang="scss">
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #1b1b1b;
  background-image: url('@/asset/bg.svg');
  position: relative;

  .view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform-origin: top left;
    border: 1px solid #fe0000;

    .line {
      position: absolute;
      // border: 1px solid #fe0000;
    }
  }
}
</style>
