<template>
  <div
    ref="mainRef"
    :class="[$style.main, props.isSelected ? $style.selected : null]"
    :style="{ left: node.x + 'px', top: node.y + 'px' }"
  >
    <div ref="headerRef" :class="$style.header" :style="{ backgroundColor: Node.typeToColor(node.type) }">
      {{ node.constructor.name.replace('Node_', '') }}
      <button @click="execute" style="margin-left: auto" v-if="node.type === 'function'">E</button>
    </div>
    <div :class="$style.body">
      <!-- Input -->
      <div v-for="(x, i) in node.input()" :class="$style.input" :key="x">
        <div
          :ref="(e) => (inputRef[x.split(':')[0]] = e)"
          :class="$style.pin"
          :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"
        ></div>
        <div
          :class="$style.pinLine"
          :style="{
            left: -20 - i * 5 + 'px',
            width: 10 + i * 5 + 'px',
            backgroundColor: Node.typeToColor(x.split(':').pop()),
          }"
        ></div>
        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <!-- Output -->
      <div v-for="x in node.output()" :class="$style.output" :key="x">
        <div
          :ref="(e) => (outputRef[x.split(':')[0]] = e)"
          :class="$style.pin"
          :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"
        ></div>

        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <!-- Props -->
      <div v-for="(v, k) in node.props" :class="$style.prop" :key="k">
        <div :class="$style.keyName">{{ k.split(':')[0] }}</div>
        <input v-if="k.split(':').pop() === 'float'" v-model="node.props[k]" />
        <input v-if="k.split(':').pop() === 'int'" v-model="node.props[k]" />
        <textarea v-if="k.split(':').pop() === 'string'" v-model="node.props[k]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Node } from '@/core/Node';
import { useMainStore } from '@/store/main';
import { useViewStore } from '@/store/view';

// Props
const props = defineProps({
  isSelected: { type: Boolean, default: false },
  node: { type: Node, required: true },
});

// Stores
const viewStore = useViewStore();

// Vars
const mainRef = ref<HTMLDivElement>();
const headerRef = ref<HTMLDivElement | null>(null);
const inputRef = ref<Record<string, HTMLDivElement>>({});
const outputRef = ref<Record<string, HTMLDivElement>>({});
const isProcessing = ref(false);

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
  }

  refresh();
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
  isProcessing.value = true;
  await props.node.execute();
  isProcessing.value = false;
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
    }
  }
}
</style>
