<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { computed } from 'vue'
import { useRouter } from 'vue-router'


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

// СПИСОК ТОВАРОВ В КОРЗИНЕ (С ДОБАВЛЕНИЕМ КОЛИЧЕСТВА)
const cartItems = computed(() =>
  usersStore.currentUser.value?.cart.map(item => {
    const product = goodsStore.getGoodsById(item.id)

    return {
      ...product,
      quantity: item.quantity
    }
  }) || []
)


// ОБЩАЯ СУММА КОРЗИНЫ
const totalPrice = computed(() =>
  cartItems.value.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  )
)


// =========================
// ФУНКЦИИ
// =========================

// УДАЛЕНИЕ ТОВАРА ИЗ КОРЗИНЫ
function removeItem(id) {
  usersStore.removeFromCart(id)
}


// ИЗМЕНЕНИЕ КОЛИЧЕСТВА ТОВАРА
function changeQuantity(id, qty) {
  const quantity = parseInt(qty)

  // ЕСЛИ НЕ ЧИСЛО — ИГНОР
  if (isNaN(quantity)) return

  // ЕСЛИ 0 ИЛИ МЕНЬШЕ — УДАЛЯЕМ
  if (quantity <= 0) {
    usersStore.removeFromCart(id)
    return
  }

  // ОБНОВЛЯЕМ КОЛИЧЕСТВО
  usersStore.updateCartQuantity(id, quantity)
}


// ПЕРЕХОД К ОФОРМЛЕНИЮ ЗАКАЗА
function checkout() {
  router.push({ name: 'checkout' })
}
</script>

<template>
  <div class="page-layout">
    <div class="main-content">

      <!-- =========================
           СЕКЦИЯ КОРЗИНЫ
           ========================= -->
      <section class="cart-section">
        <h2>Корзина</h2>


        <!-- =========================
             ПУСТАЯ КОРЗИНА
             ========================= -->
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Ваша корзина пуста</p>

          <button class="add-to-cart-btn" @click="router.push({ name: 'home' })">
            Вернуться к покупкам
          </button>
        </div>


        <!-- =========================
             СПИСОК ТОВАРОВ
             ========================= -->
        <div v-else class="cart-items">

          <div v-for="item in cartItems" :key="item.id" class="cart-item">

            <!-- КНОПКА УДАЛЕНИЯ -->
            <button class="remove-cart" @click="removeItem(item.id)">
              ✕
            </button>


            <!-- ИЗОБРАЖЕНИЕ -->
            <div class="item-img" :style="{ backgroundImage: `url(${item.image})` }"></div>


            <!-- ИНФОРМАЦИЯ -->
            <div class="item-info">

              <div class="item-title">
                {{ item.title }}
              </div>

              <div class="item-meta">

                <!-- ЦЕНА -->
                <div class="item-price">
                  {{ item.price }} ₽
                </div>


                <!-- КОНТРОЛЬ КОЛИЧЕСТВА -->
                <div class="quantity-control">

                  <button class="qty-btn" @click="changeQuantity(item.id, item.quantity - 1)">
                    -
                  </button>

                  <div class="qty-value">
                    {{ item.quantity }}
                  </div>

                  <button class="qty-btn" @click="changeQuantity(item.id, item.quantity + 1)">
                    +
                  </button>

                </div>

              </div>
            </div>
          </div>


          <!-- =========================
               ИТОГИ КОРЗИНЫ
               ========================= -->
          <div class="cart-summary">
            <div class="total">
              Итого: {{ totalPrice }} ₽
            </div>

            <button class="add-to-cart-btn accent" @click="checkout">
              Оформить заказ
            </button>
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
   СЕКЦИЯ КОРЗИНЫ
   ========================= */
.cart-section {
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
   СПИСОК ТОВАРОВ
   ========================= */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 14px;
}


/* =========================
   КАРТОЧКА ТОВАРА
   ========================= */
.cart-item {
  position: relative;

  display: flex;
  gap: 16px;

  padding: 16px;
  border-radius: 14px;

  border: 1px solid var(--border-light);

  transition: box-shadow 0.25s ease, transform 0.2s ease;
}

.cart-item:hover {
  box-shadow: var(--hover-color-card);
  transform: translateY(-2px);
}


/* =========================
   ИЗОБРАЖЕНИЕ
   ========================= */
.item-img {
  width: 90px;
  height: 90px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}


/* =========================
   ИНФОРМАЦИЯ
   ========================= */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--primary);
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-price {
  font-weight: 500;
  color: var(--text-main);
}


/* =========================
   КОНТРОЛЬ КОЛИЧЕСТВА
   ========================= */
.quantity-control {
  display: flex;
  align-items: center;
  gap: 6px;

  height: 30px;

  border: 1px solid var(--border-light);
  border-radius: 10px;

  padding: 0 6px;

  background: #fff;
}

.qty-btn {
  width: 22px;
  height: 22px;

  border: none;
  border-radius: 6px;

  background: var(--primary);
  color: #fff;

  font-weight: 600;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s ease;
  transform: none;
}

.qty-btn:hover {
  background: var(--secondary);
}

.qty-value {
  min-width: 28px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-main);
}


/* =========================
   ИТОГИ
   ========================= */
.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.total {
  font-size: 20px;
  font-weight: 600;
}


/* =========================
   КНОПКИ
   ========================= */
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
   ПУСТАЯ КОРЗИНА
   ========================= */
.empty-cart {
  text-align: center;
}


/* =========================
   УДАЛЕНИЕ
   ========================= */
.remove-cart {
  position: absolute;
  top: 10px;
  right: 10px;

  width: 26px;
  height: 26px;

  border: none;
  border-radius: 8px;

  background: transparent;
  color: rgba(0, 0, 0, 0.4);

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: background-color 0.2s ease, color 0.2s ease;

  transform: none;
}

.remove-cart:hover {
  color: #1e1717;
  background-color: none;
  box-shadow: none;
}
</style>