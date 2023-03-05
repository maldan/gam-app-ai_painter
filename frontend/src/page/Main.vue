<template>
  <div
    :class="$style.main"
    :style="{
      backgroundPositionX: viewTranslate.x + 'px',
      backgroundPositionY: viewTranslate.y + 'px',
    }"
  >
    <div
      :class="$style.view"
      :style="{ transform: 'translateX(' + viewTranslate.x + 'px) translateY(' + viewTranslate.y + 'px)' }"
    >
      <CNode
        @mousedown.stop="selectNode(n)"
        v-for="n in nodeList"
        :key="n.id"
        :is-selected="selectedNode?.id === n.id"
        :node="n"
        :style="{ zIndex: selectedNode?.id === n.id ? 2 : 1 }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CNode from '@/component/CNode.vue';
import { onMounted, ref } from 'vue';
import type { Node } from '@/core/Node';
import { Node_Vector2 } from '@/core/node/Node_Vector2';
import { Node_Int } from '@/core/node/Node_Int';
import { Node_Image } from '@/core/node/Node_Image';

// Stores

// Vars
const viewTranslate = ref({ x: 0, y: 0 });
const selectedNode = ref<any>(null);
const nodeList = ref<Node[]>([]);

// Hooks
onMounted(() => {
  let isDrag = false;
  let startDrag = { x: 0, y: 0 };
  let startTranslate = { x: 0, y: 0 };

  document.addEventListener('mousedown', (e: MouseEvent) => {
    selectNode(null);
  });

  document.addEventListener('mousedown', (e: MouseEvent) => {
    if (e.button == 1) {
      isDrag = true;
      startDrag = { x: e.pageX, y: e.pageY };
      startTranslate = { x: viewTranslate.value.x, y: viewTranslate.value.y };
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
      viewTranslate.value = { x: startTranslate.x + delta.x, y: startTranslate.y + delta.y };
    }
  });

  addNode(Node_Int);
  addNode(Node_Vector2);
  addNode(Node_Image);
});

// Methods
function selectNode(node: any) {
  selectedNode.value = node;
}

function addNode(x: any) {
  const node = new x();
  node.id = Math.random() + '';
  node.x = Math.random() * 300;
  node.y = Math.random() * 300;
  nodeList.value.push(node);
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
  // background-position-x: 10px;

  .view {
    transform: translateX(-10px);
  }
}
</style>
