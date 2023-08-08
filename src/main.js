import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import PortalVue from 'portal-vue';
import 'primeflex/primeflex.css';
import 'primevue/resources/themes/fluent-light/theme.css';
import 'primeicons/primeicons.css';
import Button from "primevue/button";
import Password from "primevue/password";
import InputText from 'primevue/inputtext';
import Image from 'primevue/image';
import Checkbox from 'primevue/checkbox';

createApp(App)
.use(PortalVue)
.use(PrimeVue)
.component('Button', Button)
.component('Password', Password)
.component('InputText', InputText)
.component('Image', Image)
.component('Checkbox', Checkbox)
.mount('#app');
