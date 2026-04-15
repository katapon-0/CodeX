<script setup>
import { useRoute } from "vue-router"
import { computed } from "vue"
import { useGoods } from "../../../composables/useGoods"
import { useUsers } from "../../../composables/useUsers"
import SidebarCatalog from '../layout/SidebarCatalog.vue'
import favoritesIcon from "../../../assets/icons/favoritesIcon.svg"

// =========================
// ROUTE (получение id товара из URL)
// =========================
const route = useRoute()

// =========================
// STORE ТОВАРОВ И ПОЛЬЗОВАТЕЛЯ
// =========================
const { getGoodsById } = useGoods()
const usersStore = useUsers()

// =========================
// ТЕКУЩИЙ ТОВАР
// =========================
// ищем товар по id из маршрута
const product = computed(() => getGoodsById(route.params.id))

// =========================
// ИЗБРАННОЕ ПОЛЬЗОВАТЕЛЯ
// =========================
// список избранных товаров текущего пользователя
const favorites = computed(() =>
  usersStore.currentUser.value?.favorites || []
)

// проверка: добавлен ли товар в избранное
function isFavorite(id) {
  return favorites.value.includes(id)
}
</script>

<template>
  <!-- =========================
       ОСНОВНОЙ LAYOUT СТРАНИЦЫ ТОВАРА
       ========================= -->
  <div class="goods-layout" v-if="product">

    <!-- боковое меню категорий -->
    <SidebarCatalog />

    <!-- =========================
         ОСНОВНОЙ КОНТЕНТ
         ========================= -->
    <div class="main-content">

      <!-- =========================
           КАРТОЧКА ТОВАРА
           ========================= -->
      <div class="product-card">

        <!-- =========================
             ЛЕВАЯ ЧАСТЬ (ИЗОБРАЖЕНИЕ)
             ========================= -->
        <div class="product-image">
          <img :src="product.image" :alt="product.title" />

          <!-- бейджи (NEW / SALE) -->
          <div class="product-labels">
            <span class="label new" v-if="product.isNew">NEW</span>
            <span class="label sale" v-if="product.sale">SALE</span>
          </div>
        </div>

        <!-- =========================
             ПРАВАЯ ЧАСТЬ (ИНФОРМАЦИЯ)
             ========================= -->
        <div class="product-info">

          <!-- =========================
               ЗАГОЛОВОК И КАТЕГОРИЯ
               ========================= -->
          <div class="product-header">
            <h1 class="product-title">{{ product.title }}</h1>
            <p class="product-category">{{ product.category }}</p>
          </div>

          <!-- =========================
               ОПИСАНИЕ ТОВАРА
               ========================= -->
          <div class="product-description-block">
            <h3 class="product-subtitle">Описание</h3>
            <p class="product-description">
              {{ product.description }}
            </p>
          </div>

          <!-- =========================
               ЦЕНА
               ========================= -->
          <div class="price-block">
            <span class="product-price">{{ product.price }} ₽</span>

            <!-- старая цена (если есть скидка) -->
            <span class="product-old-price" v-if="product.oldPrice">
              {{ product.oldPrice }} ₽
            </span>
          </div>

          <!-- =========================
               КНОПКИ ДЕЙСТВИЙ
               ========================= -->
          <div class="product-actions">

            <!-- кнопка избранного -->
            <button
              class="fav-btn"
              :class="{ active: isFavorite(product.id) }"
              @click="usersStore.toggleFavorite(product.id)"
            >
              <img :src="favoritesIcon" class="fav-icon" />
            </button>

            <!-- добавить в корзину -->
            <button
              class="add-to-cart-btn"
              @click="usersStore.addToCart(product.id, 1)"
            >
              добавить в корзину
            </button>

          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- =========================
       СОСТОЯНИЕ: ТОВАР НЕ НАЙДЕН
       ========================= -->
  <div v-else class="no-product">
    <p>Товар не найден</p>
  </div>
</template>


<style scoped>
.goods-layout {
  display: flex;
  gap: 24px;
  padding: 16px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ===== КАРТОЧКА ===== */

.product-card {
  display: flex;
  gap: 40px;
  padding: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: var(--hover-color-card);
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.product-image img {
  width: 400px;
  border-radius: 16px;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.product-title {
  font-weight: 700;
  font-size: 48px;
}

.product-category {
  font-size: 16px;
  color: #888;
}

.product-description {
  font-size: 16px;
  color: #444;
  line-height: 1.5;
}

.product-price {
  font-weight: 600;
  font-size: 24px;
}

/* ===== КНОПКИ ===== */

.product-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ❤️ ИЗБРАННОЕ */

.fav-btn {
  width: 42px;
  height: 42px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(6px);

  border: 1px solid rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  transition: all 0.18s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.fav-icon {
  width: 18px;
  height: 18px;
  opacity: 0.65;
  transition: all 0.18s ease;
}

.fav-btn:hover {
  transform: translateY(-1px) scale(1.05);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10);
}

.fav-btn:active {
  transform: scale(0.96);
}

.fav-btn.active {
  background: #111;
  border-color: #111;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.fav-btn.active .fav-icon {
  opacity: 1;
  filter: brightness(0) invert(1);
}

/* 🛒 КОРЗИНА */

.add-to-cart-btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;

  background: #111;
  color: #fff;

  font-weight: 500;
  cursor: pointer;

  transition: all 0.2s ease;
}

.add-to-cart-btn:hover {
  background: #222;
}

.add-to-cart-btn:active {
  transform: scale(0.97);
}

/* 💳 КУПИТЬ */

.buy-now-btn {
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #ddd;

  background: #fff;
  color: #111;

  cursor: pointer;
  transition: all 0.2s ease;
}

.buy-now-btn:hover {
  background: #f5f5f5;
}

.buy-now-btn:active {
  transform: scale(0.97);
}

/* ===== ПРОЧЕЕ ===== */

.no-product {
  padding: 32px;
  text-align: center;
  font-size: 20px;
}
</style>