<template>
  <div
    :class="[$style.main, props.isSelected ? $style.selected : null]"
    :style="{ left: node.x + 'px', top: node.y + 'px' }"
  >
    <div ref="headerRef" :class="$style.header" :style="{ backgroundColor: Node.typeToColor(node.type) }">
      {{ node.type }}
    </div>
    <div :class="$style.body">
      <div v-for="x in node.input()" :class="$style.input" :key="x">
        <div :class="$style.pin" :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"></div>
        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <div v-for="x in node.output()" :class="$style.output" :key="x">
        <div :class="$style.pin" :style="{ backgroundColor: Node.typeToColor(x.split(':').pop()) }"></div>
        <div :class="$style.text">{{ x.split(':')[0] }}</div>
      </div>

      <div v-for="(v, k) in node.props" :class="$style.prop" :key="k">
        <div :class="$style.keyName">{{ k.split(':')[0] }}</div>
        <input v-if="k.split(':').pop() === 'float'" v-model="node.props[k]" />
        <input v-if="k.split(':').pop() === 'int'" v-model="node.props[k]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Node } from '@/core/Node';

// Props
const props = defineProps({
  isSelected: { type: Boolean, default: false },
  node: { type: Node, required: true },
});

// Stores

// Vars
const headerRef = ref<HTMLDivElement | null>(null);

// Hooks
onMounted(() => {
  let isDrag = false;
  let startDrag = { x: 0, y: 0 };
  let startTranslate = { x: 0, y: 0 };

  if (headerRef.value) {
    headerRef.value.addEventListener('mousedown', (e: MouseEvent) => {
      isDrag = true;
      startDrag = { x: e.pageX, y: e.pageY };
      startTranslate = { x: props.node.x, y: props.node.y };
    });
    headerRef.value.addEventListener('mouseup', (e: MouseEvent) => {
      isDrag = false;
    });
    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (isDrag) {
        let delta = { x: e.pageX - startDrag.x, y: e.pageY - startDrag.y };
        props.node.x = startTranslate.x + delta.x;
        props.node.y = startTranslate.y + delta.y;
        //viewTranslate.value = { x: startTranslate.x + delta.x, y: startTranslate.y + delta.y };
      }
    });
  }
});

// Methods
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

      input {
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
