import Vue from 'vue'
import Router from 'vue-router'
const Login=()=> import('@/pages/Login')
const Home=()=> import('@/pages/Home')
const Welcome=()=> import('@/pages/Welcome')
const Tags=()=> import('@/pages/Tags')
const Article=()=> import('@/pages/Article')
const AddArticle=()=> import('@/pages/AddArticle')
const Picture=()=> import('@/pages/Picture')
const NotFound=()=> import('@/pages/NotFound')
const PictureList=()=> import('@/pages/PictureList')
const Chat=()=> import('@/pages/Chat')
const Skin=()=>import('@/pages/Skin')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/homepage',
      name: 'Home',
      component: Home,
      redirect:'/home',
      children:[
        {
          path: '/home',
          name: 'Welcome',
          component: Welcome
        },
        {
          path: '/tags',
          name: 'Tags',
          component: Tags
        },
        {
          path: '/article',
          name: 'Article',
          component: Article
        },
        {
          path: '/article/add',
          name: 'AddArticle',
          component: AddArticle
        },
        {
          path: '/picture',
          name: 'Picture',
          component: Picture
        },
        {
          path: '/picturelist',
          name: 'PictureList',
          component: PictureList
        },
        {
          path: '/chat',
          name: 'Chat',
          component: Chat
        },
        {
          path: '/skin',
          name: 'Skin',
          component: Skin
        },
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: NotFound
    },
  ]
})
