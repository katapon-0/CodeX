<script setup>
// =========================
// БАЗОВЫЕ ИМПОРТЫ
// =========================
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// =========================
// COMPOSABLES
// =========================
import { useGoods } from '../../../composables/useGoods'

// =========================
// STORES
// =========================
const router = useRouter()
const goodsStore = useGoods()

// СПИСОК КАТЕГОРИЙ ДЛЯ ОТОБРАЖЕНИЯ В САЙДБАРЕ
const categories = goodsStore.getCategories().value

// =========================
// СОСТОЯНИЕ КАТАЛОГА
// =========================
// ОТКРЫТ / ЗАКРЫТ ВСЕЙ БЛОК КАТАЛОГА
const isOpen = ref(true)

// СПИСОК ОТКРЫТЫХ КАТЕГОРИЙ
const openedCategories = ref([])

// =========================
// ФУНКЦИИ
// =========================

// ПЕРЕКЛЮЧЕНИЕ ВИДИМОСТИ ВСЕГО КАТАЛОГА
function toggleCatalog() {
  isOpen.value = !isOpen.value
}

// ПЕРЕКЛЮЧЕНИЕ ОТДЕЛЬНОЙ КАТЕГОРИИ
function toggleCategory(id) {
  if (openedCategories.value.includes(id)) {
    openedCategories.value = openedCategories.value.filter(c => c !== id)
  } else {
    openedCategories.value.push(id)
  }
}

// ПРОВЕРКА: ОТКРЫТА ЛИ КАТЕГОРИЯ
function isCategoryOpen(id) {
  return openedCategories.value.includes(id)
}

// ПЕРЕХОД НА СТРАНИЦУ ТОВАРА
function goToProduct(id) {
  router.push({ name: 'goods', params: { id } })
}
</script>

<template>
  <aside class="sidebar">
    <div class="catalog-container">

      <!-- =========================
           ШАПКА КАТАЛОГА
           ========================= -->
      <div class="catalog-header">
        <h3 @click="toggleCatalog" class="catalog-title">Каталог</h3>

        <!-- КНОПКА ВОЗВРАТА НА ГЛАВНУЮ -->
        <RouterLink :to="{ name: 'home' }" class="home-arrow">
          ←
        </RouterLink>
      </div>


      <!-- =========================
           СПИСОК КАТЕГОРИЙ
           ========================= -->
      <ul v-show="isOpen">

        <li v-for="cat in categories" :key="cat.id">

          <!-- =========================
               СТРОКА КАТЕГОРИИ
               ПЕРЕХОД + РАСКРЫТИЕ
               ========================= -->
          <div class="category-row">
            <RouterLink
              :to="{ name: 'category', params: { slug: cat.slug } }"
              class="category-title"
            >
              <span>{{ cat.title }}</span>

              <!-- КНОПКА РАСКРЫТИЯ ПОДКАТЕГОРИЙ -->
              <button class="toggle-btn" @click.stop.prevent="toggleCategory(cat.id)">
                {{ isCategoryOpen(cat.id) ? '−' : '+' }}
              </button>
            </RouterLink>
          </div>


          <!-- =========================
               ТОВАРЫ ВНУТРИ КАТЕГОРИИ
               ========================= -->
          <ul v-show="isCategoryOpen(cat.id)" class="sub-list">
            <li
              v-for="product in goodsStore.getGoodsByCategory(cat.title)"
              :key="product.id"
              @click="goToProduct(product.id)"
              class="sub-item"
            >
              {{ product.title }}
            </li>
          </ul>

        </li>

      </ul>
    </div>
  </aside>
</template>

<style scoped>
/* =========================
   SIDEBAR
   ========================= */
.sidebar {
  width: 240px;
  padding: 16px;
  border-radius: 12px;
}


/* =========================
   КОНТЕЙНЕР КАТАЛОГА
   ========================= */
.catalog-container {
  padding: 14px;
  border-radius: 12px;
  position: relative;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  background: transparent;
}


/* =========================
   ШАПКА КАТАЛОГА
   ========================= */
.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.catalog-title {
  cursor: pointer;
  margin: 0;
  font-weight: 600;
}


/* =========================
   СПИСКИ
   ========================= */
.catalog-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}


/* =========================
   СТРОКА КАТЕГОРИИ
   ========================= */
.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
}

.category-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 8px 12px;

  text-decoration: none;
  color: inherit;
  font-weight: 500;

  border-radius: 10px;
  transition: 0.18s ease;
}

.category-title:hover {
  background-color: var(--hover-color);
}


/* =========================
   КНОПКА РАСКРЫТИЯ
   ========================= */
.toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  background: transparent;
  color: inherit;

  cursor: pointer;

  font-size: 13px;
  line-height: 1;

  transition: 0.18s ease;
  transform: none;
  box-shadow: none;
  flex-shrink: 0;
}

.toggle-btn:hover {
  background-color: var(--bg-main);
}


/* =========================
   ВЛОЖЕННЫЙ СПИСОК
   ========================= */
.sub-list {
  margin-top: 6px;
  margin-left: 8px;
  padding-left: 10px;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
}


/* =========================
   ТОВАРЫ
   ========================= */
.sub-item {
  padding: 6px 10px;
  border-radius: 8px;

  cursor: pointer;
  font-size: 13.5px;

  transition: 0.15s ease;
  color: rgba(0, 0, 0, 0.75);
}

.sub-item:hover {
  background-color: var(--hover-color);
  color: #000;
}


/* =========================
   КНОПКА НА ГЛАВНУЮ
   ========================= */
.home-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: 0.2s;
}

.home-arrow:hover {
  background-color: var(--hover-color);
}
</style>