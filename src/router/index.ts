import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { checkLogin } from "../network/login"
const Login = () => import('@/pages/Login.vue')
const Home = () => import('@/pages/Home.vue')
const Tags = () => import('@/pages/Tags.vue')
const Chat = () => import('@/pages/Chats.vue')
const Skin = () => import('@/pages/Skin.vue')
const FileLists=()=>import('@/pages/FileLists.vue')
const NotFound = () => import('@/pages/NotFound.vue')
const PictureList=()=> import('@/pages/PictureList.vue')
const Music=()=>import('@/pages/Music.vue')
const Article=()=> import('@/pages/Article.vue')
const AddArticle=()=> import('@/pages/AddArticle.vue')
const Picture=()=> import('@/pages/Picture.vue')
const Welcome=()=> import('@/pages/Welcome.vue')
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/homepage',
    name: 'Home',
    component: Home,
    redirect: '/home',
    children: [
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
    ]
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来
  //next()直接放行 next('/login)强制跳转到login
  if (to.path == "/") return next();
  const { code } = await checkLogin()
  if (code != 200) return next("/")
  next()
})
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location:any) {
  return (originalPush.call(this, location) as any).catch((err:any) => err)
}
export default router
