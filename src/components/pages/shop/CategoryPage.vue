<script setup>
// =========================
// БАЗОВЫЕ ИМПОРТЫ
// =========================
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

// =========================
// COMPOSABLES 
// =========================
import { useGoods } from '../../../composables/useGoods'
import { useUsers } from '../../../composables/useUsers'

// =========================
// КОМПОНЕНТЫ И РЕСУРСЫ
// =========================
import SidebarCatalog from '../layout/SidebarCatalog.vue'
import img_for_1 from '../../../assets/img_for_cards/plug.png'
import favoritesIcon from "../../../assets/icons/favoritesIcon.svg"

// =========================
// STORES
// =========================
const usersStore = useUsers()
const goodsStore = useGoods()

// =========================
// ROUTER
// =========================
const route = useRoute()
const router = useRouter()

// =========================
// КАТЕГОРИИ И ТОВАРЫ
// =========================
const categories = goodsStore.getCategories().value
const goods = goodsStore.goods

// =========================
// ПРОВЕРКА ИЗБРАННОГО
// =========================
const isFavorite = (id) =>
  usersStore.currentUser.value?.favorites?.includes(id) ?? false

// =========================
// SLUG КАТЕГОРИИ ИЗ URL
// =========================
const categorySlug = computed(() => String(route.params.slug || ''))

// =========================
// ПОИСК КАТЕГОРИИ ПО SLUG
// =========================
const category = computed(() =>
  categories.find(c => c.slug === categorySlug.value)
)

// =========================
// СОСТОЯНИЕ СОРТИРОВКИ
// =========================
const sortOrder = ref('none')

// =========================
// ФИЛЬТРАЦИЯ ТОВАРОВ ПО КАТЕГОРИИ
// =========================
const items = computed(() => {
  if (!category.value) return []
  return goods.value.filter(g => g.category === category.value.title)
})

// =========================
// СОРТИРОВКА ТОВАРОВ
// =========================
const sortedItems = computed(() => {
  const list = [...items.value]

  if (sortOrder.value === 'asc') {
    return list.sort((a, b) => a.price - b.price)
  }

  if (sortOrder.value === 'desc') {
    return list.sort((a, b) => b.price - a.price)
  }

  return list
})
</script>

<template>
  <div class="home-layout">
    <SidebarCatalog />

    <div class="main-content">
      <div v-if="category" class="category-header">
        <h1>{{ category.title }}</h1>
        <p class="muted">Товары в категории «{{ category.title }}»</p>
      </div>

      <div v-else class="no-items">
        <p>Категория не найдена.</p>
        <button @click="router.push({ name: 'home' })" class="add-to-cart-btn">
          Вернуться на главную
        </button>
      </div>

      <div class="sort" v-if="category">
        <label>Сортировка:</label>

        <select v-model="sortOrder">
          <option value="none">Без сортировки</option>
          <option value="asc">Сначала дешевле</option>
          <option value="desc">Сначала дороже</option>
        </select>
      </div>

      <div v-if="category && sortedItems.length" class="grid">
        <div
          v-for="product in sortedItems"
          :key="product.id"
          class="product-card"
          @click="router.push({ name: 'goods', params: { id: product.id } })"
        >
          <button
            class="fav-btn"
            :class="{ active: isFavorite(product.id) }"
            @click.stop="usersStore.toggleFavorite(product.id)"
          >
            <img :src="favoritesIcon" alt="Избранное" class="fav-icon" />
          </button>

          <div class="product-card-img" :style="{ backgroundImage: `url(${product.image || img_for_1})` }"></div>

          <div class="product-card-info">
            <div class="product-card-title">{{ product.title }}</div>
            <div class="product-card-price">{{ product.price }} ₽</div>

            <button class="add-to-cart-btn accent" @click.stop="usersStore.addToCart(product.id, 1)">
              добавить в корзину
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="category" class="no-items">
        <p>В этой категории пока нет товаров.</p>
        <button @click="router.push({ name: 'home' })" class="add-to-cart-btn">
          Вернуться на главную
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-layout {
    display: flex;
    gap: 24px;
    padding: 16px;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.category-header h1 {
    margin: 0;
    font-size: 22px;
}

.muted {
    color: #6f7390;
    margin-top: 6px;
}

.grid {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 200px));
    gap: 24px;
    justify-content: start;
}

.product-card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
    background-color: #ffffff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--hover-color-card);
}

.product-card-img {
    width: 100%;
    padding-top: 120%;
    background-size: cover;
    background-position: center;
}

.product-card-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
    padding: 12px;
    height: 120px;
}

.product-card-title {
    font-weight: 600;
    font-size: 16px;
}

.product-card-price {
    font-weight: 500;
    font-size: 14px;
}

.add-to-cart-btn {
    margin-top: auto;

    padding: 6px 12px;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
}

.add-to-cart-btn:hover {
    background-color: var(--secondary);
}

.no-items {
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(40, 47, 176, 0.06);
}

.product-card {
    position: relative;
}

.fav-btn {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 38px;
    height: 38px;

    border-radius: 999px;

    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(6px);

    border: 1px solid rgba(0, 0, 0, 0.08);

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    transition: all 0.18s ease;

    z-index: 5;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}

.fav-icon {
    width: 18px;
    height: 18px;
    opacity: 0.65;
    transition: all 0.18s ease;
}

/* hover */
.fav-btn:hover {
    transform: translateY(-1px) scale(1.05);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.10);
}

.fav-btn:active {
    transform: scale(0.96);
}

/* ACTIVE — как в homepage */
.fav-btn.active {
    background: #111;
    border-color: #111;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.fav-btn.active .fav-icon {
    opacity: 1;
    filter: brightness(0) invert(1);
}

.sort {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 10px 14px;
    border-radius: 12px;

    background: #fff;
    box-shadow: 0 6px 18px rgba(40, 47, 176, 0.06);

    width: fit-content;
}

.sort label {
    font-size: 14px;
    font-weight: 500;
    color: #6f7390;
}

.sort select {
    padding: 6px 10px;

    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.08);

    background: #fff;

    font-size: 14px;
    font-weight: 500;

    cursor: pointer;

    outline: none;

    transition: all 0.2s ease;
}

.sort select:hover {
    border-color: rgba(0, 0, 0, 0.18);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.sort select:focus {
    border-color: #111;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.10);
}
</style>