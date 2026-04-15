// =========================
// ROUTER (НАСТРОЙКА МАРШРУТИЗАЦИИ)
// =========================
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
import { useUsers } from "./composables/useUsers"


// =========================
// SYSTEM (СИСТЕМНЫЕ СТРАНИЦЫ)
// =========================
import NotFound from "./components/pages/system/404.vue"


// =========================
// SHOP (СТРАНИЦЫ МАГАЗИНА)
// =========================
import HomePage from "./components/pages/shop/HomePage.vue"
import Tovar from "./components/pages/shop/GoodsPage.vue"
import CategoryPage from "./components/pages/shop/CategoryPage.vue"
import CheckOutPage from "./components/pages/shop/CheckoutPage.vue"


// =========================
// AUTH (АВТОРИЗАЦИЯ / РЕГИСТРАЦИЯ)
// =========================
import RegisterForm from "./components/pages/auth/RegisterForm.vue"
import LoginForm from "./components/pages/auth/LoginForm.vue"


// =========================
// USER (ПОЛЬЗОВАТЕЛЬСКИЕ СТРАНИЦЫ)
// =========================
import CartPage from "./components/pages/user/CartPage.vue"
import FavoritesPage from "./components/pages/user/FavoritesPage.vue"
import UserProfile from "./components/pages/user/UserProfile.vue"


// =========================
// ADMIN (АДМИН-ПАНЕЛЬ)
// =========================
import AdminPanel from "./components/admin/AdminPanel.vue"
import AdminAddProduct from "./components/admin/AdminAddProduct.vue"
import AdminGoodsList from "./components/admin/AdminGoodsList.vue"
import AdminEditProduct from "./components/admin/AdminEditProduct.vue"
import AdminWelcome from "./components/admin/AdminWelcome.vue"


// =========================
// STORE (ПОЛЬЗОВАТЕЛЬ)
// =========================
const store = useUsers()


// =========================
// ОПИСАНИЕ МАРШРУТОВ
// =========================
const routes = [

  // -------- МАГАЗИН --------
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { title: 'CODEX - ГЛАВНАЯ' }
  },
  {
    path: "/goods/:id",
    name: "goods",
    component: Tovar,
    meta: { title: 'CODEX - ТОВАР' }
  },
  {
    path: "/category/:slug",
    name: "category",
    component: CategoryPage,
    meta: { title: 'CODEX - КАТЕГОРИЯ' }
  },
  {
    path: "/checkoutpage",
    name: "checkout",
    component: CheckOutPage,
    meta: { title: 'CODEX - ОПЛАТА' }
  },


  // -------- АВТОРИЗАЦИЯ --------
  {
    path: "/login",
    name: "login",
    component: LoginForm,
    meta: { title: 'CODEX - АВТОРИЗАЦИЯ' }
  },
  {
    path: "/register",
    name: "register",
    component: RegisterForm,
    meta: { title: 'CODEX - РЕГИСТРАЦИЯ' }
  },


  // -------- ПОЛЬЗОВАТЕЛЬ --------
  {
    path: "/profile",
    name: "profile",
    component: UserProfile,
    meta: {
      title: 'CODEX - ПРОФИЛЬ',
      requiresAuth: true // ТРЕБУЕТ АВТОРИЗАЦИИ
    }
  },
  {
    path: "/cart",
    name: "cart",
    component: CartPage,
    meta: {
      title: 'CODEX - КОРЗИНА',
      requiresAuth: true
    }
  },
  {
    path: "/favorites",
    name: "favorites",
    component: FavoritesPage,
    meta: {
      title: 'CODEX - ИЗБРАННОЕ',
      requiresAuth: true
    }
  },

  // -------- АДМИН-ПАНЕЛЬ --------
  {
    path: "/admin",
    name: "admin",
    component: AdminPanel,
    meta: {
      requiresAdmin: true // ДОСТУП ТОЛЬКО ДЛЯ АДМИНА
    },
    redirect: { name: "admin-welcome" },
    children: [

      // ГЛАВНАЯ СТРАНИЦА АДМИНКИ
      {
        path: "",
        name: "admin-welcome",
        component: AdminWelcome
      },

      // СПИСОК ТОВАРОВ
      {
        path: "list",
        name: "admin-list",
        component: AdminGoodsList
      },

      // ДОБАВЛЕНИЕ ТОВАРА
      {
        path: "add",
        name: "admin-add",
        component: AdminAddProduct
      },

      // РЕДАКТИРОВАНИЕ ТОВАРА
      {
        path: "edit/:id",
        name: "admin-edit",
        component: AdminEditProduct,
        props: true // ПЕРЕДАЁМ ID В КОМПОНЕНТ
      }
    ]
  },


  // -------- 404 --------
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]


// =========================
// СОЗДАНИЕ ROUTER
// =========================
export const router = createRouter({
  history: createWebHashHistory(),
  routes
})


// =========================
// GUARDS (ЗАЩИТА МАРШРУТОВ)
// =========================


// --- ПРОВЕРКА НА АДМИНА ---
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin && !store.isAdmin()) {
    next({ name: "home" }) // ЕСЛИ НЕ АДМИН -> НА ГЛАВНУЮ
  } else {
    next()
  }
})


// --- ПРОВЕРКА АВТОРИЗАЦИИ ---
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isAuth()) {
    next({ name: "login" }) // ЕСЛИ НЕ АВТОРИЗОВАН -> ЛОГИН
  } else {
    next()
  }
})