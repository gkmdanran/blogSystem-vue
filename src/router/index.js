import Vue from 'vue'
import Router from 'vue-router'
import {checkLogin} from "../network/login"
const Login=()=> import('@/pages/Login')
const Home=()=> import('@/pages/Home')
const Welcome=()=> import('@/pages/Welcome')
const Tags=()=> import('@/pages/Tags')
const Article=()=> import('@/pages/Article')
const AddArticle=()=> import('@/pages/AddArticle')
const Picture=()=> import('@/pages/Picture')
const NotFound=()=> import('@/pages/NotFound')
const PictureList=()=> import('@/pages/PictureList')
const Chat=()=> import('@/pages/Chats')
const Skin=()=>import('@/pages/Skin')
const FileLists=()=>import('@/pages/FileLists')
const Music=()=>import('@/pages/Music')
Vue.use(Router)



var router=new Router({
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
        {
          path: '/filelists',
          name: 'FileLists',
          component: FileLists
        },
        {
          path: '/music',
          name: 'Music',
          component: Music
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
router.beforeEach(async (to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next()直接放行 next('/login)强制跳转到login
  if(to.path=="/")return next();
  const {code}=await checkLogin()
  if(code!=200) return next("/")
  next()
})
export default router