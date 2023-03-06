import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './style.scss';
import App from './App.vue';
import router from './router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import { useMainStore } from '@/store/main';

dayjs.extend(customParseFormat);
dayjs.extend(duration);

const app = createApp(App);

app.use(createPinia());
app.use(router);

const nodeList = Object.keys(import.meta.globEager('@/core/node/**/*.ts'));
const mainStore = useMainStore();
mainStore.nodeClassList = nodeList
  .map((x: string) => x.split('/').pop() as string)
  .map((x: string) => x.replace('.ts', ''));

app.mount('#app');
