<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import image from '../../../assets/img_for_cards/plug.png'


// =========================
// ROUTER
// =========================
const router = useRouter()


// =========================
// STORES
// =========================
import { useUsers } from '../../../composables/useUsers'
import { useGoods } from '../../../composables/useGoods'

const usersStore = useUsers()
const goodsStore = useGoods()


// =========================
// COMPUTED СВОЙСТВА
// =========================

// СПИСОК ИЗБРАННЫХ ТОВАРОВ (ПОЛНЫЕ ОБЪЕКТЫ)
const favoriteItems = computed(() => {
    const favs = usersStore.currentUser.value?.favorites || []

    return favs
        .map(id => goodsStore.getGoodsById(id))
        .filter(Boolean) // ЕСЛИ ТОВАР НЕ НАЙДЕН — УБИРАЕМ
})


// =========================
// ФУНКЦИИ
// =========================

// ПЕРЕХОД НА СТРАНИЦУ ТОВАРА
function goToProduct(id) {
    router.push({ name: 'goods', params: { id } })
}

// УДАЛЕНИЕ ИЗ ИЗБРАННОГО
function removeFromFavorites(id) {
    usersStore.removeFromFavorites(id)
}

// ДОБАВЛЕНИЕ В КОРЗИНУ
function addToCart(id) {
    usersStore.addToCart(id, 1)
}
</script>

<template>
    <div class="page-layout">
        <div class="main-content">

            <!-- =========================
                 СЕКЦИЯ ИЗБРАННОГО
                 ========================= -->
            <section class="fav-section">
                <h2>Избранное</h2>

                <!-- =========================
                     ПУСТОЕ СОСТОЯНИЕ
                     ========================= -->
                <div v-if="favoriteItems.length === 0" class="empty">
                    <p>Список избранного пуст</p>

                    <button class="btn" @click="router.push({ name: 'home' })">
                        Перейти к товарам
                    </button>
                </div>


                <!-- =========================
                     СПИСОК ТОВАРОВ
                     ========================= -->
                <div v-else class="fav-items">

                    <div
                        v-for="item in favoriteItems"
                        :key="item.id"
                        class="fav-item"
                    >

                        <!-- КНОПКА УДАЛЕНИЯ -->
                        <button
                            class="remove-fav"
                            @click="removeFromFavorites(item.id)"
                        >
                            ✕
                        </button>


                        <!-- ЛЕВАЯ ЧАСТЬ (КАРТИНКА) -->
                        <div class="fav-left">
                            <div
                                class="fav-img"
                                :style="{ backgroundImage: `url(${item.image || image})` }"
                                @click="goToProduct(item.id)"
                            />
                        </div>


                        <!-- ЦЕНТР (ИНФА) -->
                        <div class="fav-middle">
                            <div
                                class="fav-title"
                                @click="goToProduct(item.id)"
                            >
                                {{ item.title }}
                            </div>

                            <div class="fav-price">
                                {{ item.price }} ₽
                            </div>
                        </div>


                        <!-- ПРАВАЯ ЧАСТЬ (ДЕЙСТВИЯ) -->
                        <div class="fav-right">
                            <button
                                class="cart-btn"
                                @click="addToCart(item.id)"
                            >
                                В корзину
                            </button>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>

/* =========================
   ОСНОВНОЙ ЛЕЙАУТ
   ========================= */
.page-layout {
    display: flex;
    gap: 24px;
    padding: 16px;
}

.main-content {
    flex: 1;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
}


/* =========================
   СЕКЦИЯ ИЗБРАННОГО
   ========================= */
.fav-section {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    background: #fff;
    padding: 32px;
    border-radius: 16px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}


/* =========================
   ПУСТОЕ СОСТОЯНИЕ (ЦЕНТРИРОВАНО)
   ========================= */
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    gap: 12px;

    padding: 40px 0;
}


/* =========================
   СПИСОК ТОВАРОВ
   ========================= */
.fav-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
}


/* ===== CARD ===== */
.fav-item {
    position: relative;

    display: flex;
    align-items: center;
    gap: 16px;

    padding: 14px 48px 14px 16px;

    border-radius: 14px;
    border: 1px solid var(--border-light);

    transition: box-shadow 0.25s ease, border-color 0.25s ease;
    will-change: box-shadow, border-color;
}

.fav-item:hover {
    box-shadow: var(--hover-color-card);
    border-color: rgba(15, 16, 29, 0.15);
}


/* ===== IMAGE ===== */
.fav-img {
    width: 84px;
    height: 84px;

    border-radius: 12px;

    background-size: cover;
    background-position: center;

    cursor: pointer;
    flex-shrink: 0;
}


/* ===== INFO ===== */
.fav-middle,
.fav-info {
    flex: 1;

    display: flex;
    flex-direction: column;
    gap: 6px;
}

.fav-title {
    font-weight: 600;
    cursor: pointer;
    color: var(--primary);
}

.fav-title:hover {
    text-decoration: underline;
}

.fav-price {
    font-weight: 500;
    opacity: 0.9;
}


/* ===== ACTION ===== */
.fav-right {
    flex-shrink: 0;

    display: flex;
    align-items: center;
}

.cart-btn {
    width: 120px;
    height: 30px;

    border: none;
    background: var(--primary);
    color: white;

    cursor: pointer;
    font-weight: 500;

    white-space: nowrap;

    transition: background-color 0.2s ease;

    transform: none;

    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-btn:hover {
    background: var(--secondary);
    transform: none;
}


/* ===== DELETE ===== */
.remove-fav {
    position: absolute;
    top: 10px;
    right: 10px;

    width: 26px;
    height: 26px;

    border-radius: 8px;
    border: none;

    background: transparent;
    color: rgba(0, 0, 0, 0.4);

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-fav:hover {
    color: #1e1717;
    background-color: none;
    box-shadow: none;
}

</style>