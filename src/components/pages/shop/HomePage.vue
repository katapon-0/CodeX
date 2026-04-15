<script setup>
// =========================
// ИМПОРТЫ КОМПОНЕНТОВ И РЕСУРСОВ
// =========================
import SidebarCatalog from '../layout/SidebarCatalog.vue'
import favoritesIcon from "../../../assets/icons/INfavoriteIcon.svg"
import banner from '../../../assets/ui/banner2TEST.png'


// =========================
// ИМПОРТЫ COMPOSABLES 
// =========================
import { useGoods } from "../../../composables/useGoods"
import { useUsers } from "../../../composables/useUsers"


// =========================
// ИНИЦИАЛИЗАЦИЯ STORES
// =========================
const goodsStore = useGoods()
const goods = goodsStore.goods

const usersStore = useUsers()


// =========================
// РОУТЕР
// =========================
import { useRouter } from 'vue-router'
const router = useRouter()


// =========================
// COMPUTED СВОЙСТВА
// =========================
import { computed } from 'vue'

const favorites = computed(() =>
    usersStore.currentUser.value?.favorites || []
)


// =========================
// ФУНКЦИИ
// =========================

// ПЕРЕХОД НА СТРАНИЦУ ТОВАРА
function goToProduct(id) {
    router.push({ name: 'goods', params: { id } })
}

// ПРОВЕРКА, В ИЗБРАННОМ ЛИ ТОВАР
function isFavorite(id) {
    return favorites.value.includes(id)
}
</script>

<template>
    <div class="home-layout">
        <SidebarCatalog />

        <div class="main-content">

            <!-- =========================
                 БАННЕР
                 ========================= -->
            <router-link :to="{ name: 'category', params: { slug: 'utilities' } }">
                <div class="bannerr">
                    <img :src="banner" alt="Баннер" />
                </div>
            </router-link>


            <!-- =========================
                 ЛУЧШИЕ ПРЕДЛОЖЕНИЯ
                 ========================= -->
            <section class="products-section">
                <h2>Лучшие предложения</h2>
                <p>операционные системы и программное обеспечение</p>

                <div class="grid">
                    <div
                        v-for="product in goods"
                        :key="product.id"
                        class="product-card"
                        @click="goToProduct(product.id)"
                    >

                        <!-- КНОПКА ИЗБРАННОГО -->
                        <button
                            class="fav-btn"
                            :class="{ active: isFavorite(product.id) }"
                            @click.stop="usersStore.toggleFavorite(product.id)"
                        >
                            <img :src="favoritesIcon" alt="Избранное" class="fav-icon" />
                        </button>


                        <!-- ИЗОБРАЖЕНИЕ ТОВАРА -->
                        <div
                            class="product-card-img"
                            :style="{ backgroundImage: `url(${product.image})` }"
                        ></div>


                        <!-- ИНФОРМАЦИЯ О ТОВАРЕ -->
                        <div class="product-card-info">
                            <div class="product-card-title">{{ product.title }}</div>
                            <div class="product-card-price">{{ product.price }} ₽</div>

                            <!-- КНОПКА ДОБАВЛЕНИЯ В КОРЗИНУ -->
                            <button
                                class="add-to-cart-btn accent"
                                @click.stop="usersStore.addToCart(product.id, 1)"
                            >
                                добавить в корзину
                            </button>
                        </div>

                    </div>
                </div>
            </section>


            <!-- =========================
                 КАТЕГОРИИ
                 ========================= -->
            <section class="categories">
                <h2>Категории</h2>

                <div class="category-grid">
                    <router-link
                        v-for="cat in goodsStore.getCategories().value"
                        :key="cat.id"
                        :to="{ name: 'category', params: { slug: cat.slug } }"
                        class="category-card"
                    >
                        <div
                            class="category-card-img"
                            :style="{ backgroundImage: `url(${cat.image})` }"
                        ></div>

                        <div class="category-card-title">
                            {{ cat.title }}
                        </div>
                    </router-link>
                </div>
            </section>

        </div>
    </div>
</template>

<style scoped>

/* =========================
   ОСНОВНОЙ ЛЕЙАУТ
   ========================= */
.home-layout {
    display: flex;
    gap: 24px;
    padding: 16px;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 48px;
}


/* =========================
   БАННЕР
   ========================= */
.bannerr {
    width: 100%;
    max-height: 300px;
    overflow: hidden;
    border-radius: 16px;
}

.bannerr img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    transition: opacity 0.6s ease;
}


/* =========================
   СЕТКИ
   ========================= */
.grid,
.category-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
}


/* =========================
   КАРТОЧКИ ТОВАРОВ
   ========================= */
.product-card {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
    text-align: center;
    background-color: #ffffff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    height: 100%;
    position: relative;
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
    justify-content: space-between;
    gap: 8px;
    text-align: center;
    padding: 12px;
    height: 100%;
}

.product-card-title {
    font-weight: 600;
    font-size: 16px;
}

.product-card-price {
    font-weight: 500;
    font-size: 19px;
}


/* КНОПКА КОРЗИНЫ */
.add-to-cart-btn {
    margin-top: 4px;
    padding: 6px 12px;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
}


/* =========================
   КАРТОЧКИ КАТЕГОРИЙ
   ========================= */
.category-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
}

.category-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    text-align: center;
    background-color: #ffffff;
    padding: 10px;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.category-card:hover {
    transform: translateY(-3px);
    box-shadow: rgba(0, 0, 0, 0.06) 0px 6px 18px;
}

.category-card-img {
    width: 100%;
    padding-top: 80%;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
}

.category-card-title {
    font-weight: 600;
    font-size: 15px;
}


/* =========================
   КНОПКА ИЗБРАННОГО
   ========================= */
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
    object-fit: contain;

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

</style>