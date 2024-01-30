// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ModelUi from '@/views/modelUI/ModelUI.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/model/:hash', // Dynamic segment :hash
    name: 'model', // Optional: You can give the route a name
    component: ModelUi // Replace with the actual component for the model view
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
