<template>
  <div
    ref="mainRef"
    :class="[$style.main, props.isSelected ? $style.selected : null]"
    :style="{ left: node.x + 'px', top: node.y + 'px' }"
  >
    <input ref="imagePicker" type="file" style="display: none" />

    <div ref="headerRef" :class="$style.header" :style="{ backgroundColor: Node.typeToColor(node.type) }">
      {{ node.constructor.name.replace('Node_', '') }} {{ ~~node.x }} {{ ~~node.y }}
      <button :disabled="node.isProcessing" @click="execute" style="margin-left: auto">&gt;</button>
    </div>
    <div :class="$style.body">
      <!-- Input -->
      <div v-for="(x, i) in node.input()" :class="$style.input" :key="x">
        <div
          :class="$style.pinLine"
          :style="{
            left: -20 - i * 5 + 'px',
            width: 10 + i * 5 + 'px',
            backgroundColor: Node.typeToColor(x.split(':').pop()),
          }"
        ></div>
        <div
          @mouseover="hoverPin(x)"
          @mouseout="clearPin()"
          :ref="(e) => (inputRef[x.split(':')[0]] = e)"
          :class="$style.pin"
          :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"
        ></div>

        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <!-- Output -->
      <div v-for="x in node.output()" :class="$style.output" :key="x">
        <div
          @mousedown="grabPin(x)"
          :ref="(e) => (outputRef[x.split(':')[0]] = e)"
          :class="$style.pin"
          :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"
        ></div>

        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <!-- Props -->
      <div v-for="(v, k) in node.props" :class="$style.prop" :key="k">
        <div :class="$style.keyName">{{ k.split(':')[0] }}</div>

        <input v-if="k.split(':').pop() === 'float'" type="number" v-model="node.props[k]" />
        <input @wheel.prevent="" v-if="k.split(':').pop() === 'int'" type="number" v-model="node.props[k]" />
        <textarea v-if="k.split(':').pop() === 'string'" v-model="node.props[k]" />

        <!-- Image -->
        <div v-if="k.split(':').pop() === 'image'">
          <img :src="node.props[k]" />
          <button @click="imagePicker.click()">Pick</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Node } from '@/core/Node';
import { useMainStore } from '@/store/main';
import { useViewStore } from '@/store/view';
import { useDocumentStore } from '@/store/document';
import { useAPIStore } from '@/store/api';

// Props
const props = defineProps({
  isSelected: { type: Boolean, default: false },
  node: { type: Node, required: true },
});

// Stores
const viewStore = useViewStore();
const documentStore = useDocumentStore();
const apiStore = useAPIStore();

// Vars
const mainRef = ref<HTMLDivElement>();
const headerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<Record<string, HTMLDivElement>>({});
const outputRef = ref<Record<string, HTMLDivElement>>({});
const imagePicker = ref<HTMLInputElement>();

// Hooks
onMounted(() => {
  let isDrag = false;
  let startDrag = { x: 0, y: 0 };
  let startTranslate = { x: 0, y: 0 };

  if (headerRef.value) {
    headerRef.value.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button != 0) return;
      isDrag = true;
      startDrag = { x: e.pageX / viewStore.zoom, y: e.pageY / viewStore.zoom };
      startTranslate = { x: props.node.x, y: props.node.y };
    });
    headerRef.value.addEventListener('mouseup', (e: MouseEvent) => {
      isDrag = false;
    });
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (isDrag) {
        let delta = { x: e.pageX / viewStore.zoom - startDrag.x, y: e.pageY / viewStore.zoom - startDrag.y };
        props.node.x = startTranslate.x + delta.x;
        props.node.y = startTranslate.y + delta.y;
        refresh();
      }
    });

    document.addEventListener('mouseup', (e: MouseEvent) => {
      if (props.node.id === documentStore.dragToNodeId) {
        const fromTuple = documentStore.dragFromPin.split(':');
        const toTuple = documentStore.dragToPin.split(':');

        // Not same types
        if (fromTuple[1] != toTuple[1]) return;

        // Connect
        documentStore.connectById(
          documentStore.dragFromNodeId,
          documentStore.dragToNodeId,
          fromTuple[0] + ':' + toTuple[0],
        );
      }
    });
  }

  refresh();

  if (imagePicker.value) {
    imagePicker.value?.addEventListener('change', (e) => {
      // @ts-ignore
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        async () => {
          // @ts-ignore
          const response = await apiStore.uploadImage(reader.result);
          console.log(response);
          // @ts-ignore
          props.node.props['image:image'] = response;
        },
        false,
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    });
  }
});

// Methods
function refresh() {
  if (!mainRef.value) return;

  const mainPos = mainRef.value.getBoundingClientRect();

  // Output
  let id = 0;
  for (const key in outputRef.value) {
    const pinPos = outputRef.value[key].getBoundingClientRect();

    props.node.outputPinPosition[key] = {
      x: props.node.x + (pinPos.x - mainPos.x) / viewStore.zoom,
      y: props.node.y + (pinPos.y - mainPos.y) / viewStore.zoom + 5,
    };
  }

  id = 1;
  for (const key in inputRef.value) {
    const pinPos = inputRef.value[key].getBoundingClientRect();
    props.node.inputPinPosition[key] = {
      x: props.node.x + (pinPos.x - mainPos.x) / viewStore.zoom - id * 5,
      y: props.node.y + (pinPos.y - mainPos.y) / viewStore.zoom + 5,
    };
    id += 1;
  }
}

async function execute() {
  await props.node.execute();
}

function grabPin(x: string) {
  documentStore.dragFromPin = x;
  documentStore.dragFromNodeId = props.node.id;
}

function hoverPin(x: string) {
  documentStore.dragToPin = x;
  documentStore.dragToNodeId = props.node.id;
}

function clearPin() {
  documentStore.dragToPin = '';
  documentStore.dragToNodeId = '';
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

  &.selected {
    border: 2px dashed rgba(255, 255, 255, 0.3);
  }

  .header {
    background-color: rgba(223, 5, 52, 0.4);
    padding: 5px 10px;
    border-radius: 8px 8px 0 0;
    text-transform: capitalize;
    display: flex;

    button {
      cursor: pointer;
      background: rgba(0, 0, 0, 0.7);
      color: #fefefe;
      border: 0;
      border-radius: 4px;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        position: relative;
        top: 1px;
        opacity: 0.75;
      }

      &:disabled {
        background: rgba(0, 0, 0, 0.3);
        cursor: not-allowed;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .body {
    padding: 5px 10px;
    position: relative;

    .input,
    .output {
      position: relative;
      padding: 5px;

      .pin {
        left: -16px;
        top: 8px;
        position: absolute;
        background-color: #b91e1e;
        width: 10px;
        height: 10px;
        border-radius: 8px;
        border: 1px solid #1b1b1b;

        &:hover {
          border: 1px solid #fefefe;
        }
      }

      .pinLine {
        left: -20px;
        top: 13px;
        position: absolute;
        width: 20px;
        height: 2px;
        background: #fefefe;
        //border-top: 3px solid #b91e1e;
      }
    }

    .output {
      .pin {
        left: unset;
        right: -16px;
        background-color: #5fb91e;
      }
      .text {
        text-align: right;
      }
    }

    .prop {
      display: flex;
      margin-bottom: 5px;

      .keyName {
        padding-right: 10px;
      }

      input,
      textarea {
        width: 48px;
        background: rgba(0, 0, 0, 0.4);
        color: rgba(255, 255, 255, 0.5);
        border: 0;
        border-radius: 4px;
        padding: 5px;
        outline: none;
      }

      img {
        display: block;
        max-width: 256px;
      }
    }
  }
}
</style>
