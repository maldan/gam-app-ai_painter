<template>
  <div :class="$style.main">
    <input v-if="type === 'int'" type="number" :value="modelValue" @change="changeNumber" />
    <input v-if="type === 'float'" type="number" step="0.1" :value="modelValue" @change="changeNumber" />

    <textarea v-if="type === 'string'" @change="changeString" :value="modelValue"></textarea>

    <div v-if="type === 'image'">
      <img :src="modelValue" style="max-width: 256px" alt="Image" />
    </div>
    <div v-if="type === 'vector2'" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; width: 128px">
      <input type="number" :value="modelValue.x" @change="changeVector2($event, 'x')" />
      <input type="number" :value="modelValue.y" @change="changeVector2($event, 'y')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useViewStore } from '@/store/view';
import { useDocumentStore } from '@/store/document';
import { useAPIStore } from '@/store/api';
import { useMainStore } from '@/store/main';
import { Node } from '@/core/Node';

// Props
const props = defineProps({
  type: String,
  node: Node,
  modelValue: { type: [Object, Number, String, Boolean], required: true },
});
const emit = defineEmits(['update:modelValue']);

// Stores
const viewStore = useViewStore();
const documentStore = useDocumentStore();
const apiStore = useAPIStore();
const mainStore = useMainStore();

// Vars

// Hooks
onMounted(() => {});

// Methods
function changeNumber(e: any) {
  emit('update:modelValue', Number(e.target.value));
}
function changeVector2(e: any, field: string) {
  // @ts-ignore
  if (field === 'x') emit('update:modelValue', { x: Number(e.target.value), y: props.modelValue.y });
  // @ts-ignore
  if (field === 'y') emit('update:modelValue', { x: props.modelValue.x, y: Number(e.target.value) });
}
function changeString(e: any) {
  emit('update:modelValue', e.target.value);
}
</script>

<style module lang="scss">
.main {
  input,
  textarea {
    margin-top: 5px;
    border: 0;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    outline: none;
    color: rgba(255, 255, 255, 0.5);
    padding: 5px;
    width: calc(100% - 10px);
  }
}
</style>
