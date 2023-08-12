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
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import ScrollTop from 'primevue/scrolltop';
import Ripple from 'primevue/ripple';
import MegaMenu from 'primevue/megamenu';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';

createApp(App)
.use(PortalVue)
.use(PrimeVue, { ripple: true })
.component('Button', Button)
.component('Password', Password)
.component('InputText', InputText)
.component('Image', Image)
.component('Checkbox', Checkbox)
.component('Card', Card)
.component('Avatar', Avatar)
.component('ScrollTop', ScrollTop)
.component('MegaMenu', MegaMenu)
.component('Menu', Menu)
.component('Toast', Toast)
.mount('#app');
