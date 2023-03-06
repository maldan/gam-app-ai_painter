<template>
  <div :class="$style.main" :style="{ left: x + 'px', top: y + 'px' }">
    <div @click.stop="createNode(x)" :class="$style.item" v-for="x in mainStore.nodeClassList" :key="x">
      {{ x }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useViewStore } from '@/store/view';
import { useDocumentStore } from '@/store/document';
import { useAPIStore } from '@/store/api';
import { useMainStore } from '@/store/main';

// Props
const props = defineProps({
  x: Number,
  y: Number,
});

// Stores
const viewStore = useViewStore();
const documentStore = useDocumentStore();
const apiStore = useAPIStore();
const mainStore = useMainStore();

// Vars

// Hooks
onMounted(() => {});

// Methods
function createNode(className: string) {
  documentStore.createNode(className, {
    x: viewStore.cursor.x,
    y: viewStore.cursor.y,
  });
  viewStore.toggleNodePicker(false);
}
</script>

<style module lang="scss">
.main {
  display: flex;
  flex-direction: column;
  background-color: #2b2b2b;
  border-radius: 8px;
  user-select: none;
  font-size: 14px;
  position: absolute;
  border: 2px solid rgba(0, 0, 0, 1);
  z-index: 3;

  .item {
    cursor: pointer;
    padding: 5px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);

    &:hover {
      background: mix(#2b2b2b, #ff0000, 50%);
    }
  }
}
</style>
