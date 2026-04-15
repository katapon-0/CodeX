<script setup>
// =========================
// БАЗОВЫЕ ИМПОРТЫ 
// =========================
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// =========================
// COMPOSABLES
// =========================
import { useUsers } from '../../../composables/useUsers'
import { useGoods } from '../../../composables/useGoods'

// =========================
// ИКОНКИ / ЛОГО
// =========================
import logo from '../../../assets/ui/logo.png'
import adminIcon from "../../../assets/icons/settings.svg"
import profileIcon from "../../../assets/icons/profileIcon.svg"
import logoutIcon from '../../../assets/icons/logoutIcon.svg'
import cartIcon from "../../../assets/icons/cartIcon.svg"
import favoritesIcon from '../../../assets/icons/favoritesIcon.svg'

// =========================
// ROUTER
// =========================
const router = useRouter()

// =========================
// ДАННЫЕ ПОЛЬЗОВАТЕЛЯ И ТОВАРОВ
// =========================
const { currentRole, currentUser, isAuth, isAdmin, logoutUser, cartCount } = useUsers()
const { goods } = useGoods()

// =========================
// СОСТОЯНИЕ ПОИСКА
// =========================
const searchQuery = ref('')        // текст поиска
const showResults = ref(false)     // показывать/скрывать выпадающий список

// =========================
// ПРОВЕРКИ СОСТОЯНИЯ
// =========================
const isAuthor = computed(() => isAuth())     // авторизован ли пользователь
const isAdminis = computed(() => isAdmin())   // является ли админом

// =========================
// ФИЛЬТРАЦИЯ ТОВАРОВ ПО ПОИСКУ
// =========================
const filteredGoods = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return []

  return goods.value.filter(g =>
    g.title.toLowerCase().includes(query)
  )
})

// =========================
// ПЕРЕХОД НА СТРАНИЦУ ТОВАРА
// =========================
function goToProduct(id) {
  searchQuery.value = ''
  showResults.value = false
  router.push({ name: 'goods', params: { id } })
}

// =========================
// ВОЗВРАТ НА ГЛАВНУЮ ПОСЛЕ ЛОГАУТА
// =========================
function goHomeWhenLogouted() {
  router.push({ name: 'home' })
}

// =========================
// ВЫХОД ИЗ АККАУНТА
// =========================
function logOut() {
  logoutUser()
  searchQuery.value = ''
  showResults.value = false
  goHomeWhenLogouted()
}

// =========================
// СКРЫТИЕ РЕЗУЛЬТАТОВ ПОИСКА С ЗАДЕРЖКОЙ
// (чтобы клик по элементу успел сработать)
// =========================
function hideResults() {
  setTimeout(() => {
    showResults.value = false
  }, 150)
}
</script>

<template>
  <header class="menu-bar">
    <div class="left">
      <div class="logo-container">
        <router-link :to="{ name: 'home' }">
          <img :src="logo" alt="Логотип" class="logo" />
        </router-link>
      </div>
    </div>

    <div class="center">
      <input
        type="text"
        placeholder="Поиск..."
        class="search-input"
        v-model="searchQuery"
        @focus="showResults = true"
        @blur="hideResults"
      />

      <div v-if="showResults && filteredGoods.length" class="search-dropdown">
        <div
          v-for="item in filteredGoods"
          :key="item.id"
          class="search-item"
          @mousedown.prevent="goToProduct(item.id)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>

    <nav class="menu right-menu">
      <router-link v-if="currentRole === 'guest'" :to="{ name: 'login' }" class="menu-button">
        Войти
      </router-link>

      <router-link v-if="isAuthor" :to="{ name: 'favorites' }" class="profile-link">
        <img :src="favoritesIcon" alt="Избранное" class="profile-icon" />
      </router-link>

      <router-link v-if="isAuthor" :to="{ name: 'cart' }" class="profile-link cart-wrapper">
        <img :src="cartIcon" alt="Корзина" class="profile-icon" />
        <span v-if="cartCount > 0" class="cart-badge">
          {{ cartCount }}
        </span>
      </router-link>

      <span v-if="currentUser" class="role-display">Вы вошли как: {{ currentUser.name }}</span>

      <router-link v-if="isAdminis" :to="{ name: 'admin' }" class="profile-link">
        <img :src="adminIcon" alt="Админ панель" class="profile-icon" />
      </router-link>

      <router-link v-if="isAuthor" :to="{ name: 'profile' }" class="profile-link">
        <img :src="profileIcon" alt="Профиль" class="profile-icon" />
      </router-link>

      <div v-if="isAuthor" class="profile-link" @click="logOut">
        <img :src="logoutIcon" alt="Выйти" class="profile-icon" />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.menu-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-bottom: var(--border-color);
  z-index: 1000;
}

.left {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 0 32px;
}

.logo-container {
  height: 40px;
  width: auto;
  overflow: hidden;
}

.logo {
  height: 100%;
  width: auto;
}

.menu {
  display: flex;
  gap: 24px;
}

.center {
  flex: 1;
  display: flex;
  justify-content: center;
  position: relative;
}

.search-input {
  width: 60%;
  max-width: 400px;
  padding: 6px 12px;
  font-size: 14px;
}

.right-menu {
  margin-right: 32px;
}

.profile-link {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 22px;
  height: 22px;
  cursor: pointer;
  transition: transform 0.2s;
}

.profile-icon:hover {
  transform: scale(1.1);
}

.cart-wrapper {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 5px;
  height: 15px;
  padding: 0 5px;
  background: #1c1c1c;
  color: white;
  font-size: 8px;
  font-weight: 600;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.search-dropdown {
  position: absolute;
  top: 50px;
  width: 60%;
  max-width: 400px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  z-index: 2000;
  max-height: 250px;
  overflow-y: auto;
}

.search-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.search-item:hover {
  background: #f3f3f3;
}
</style>