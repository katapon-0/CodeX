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
// СТОРЫ И РОУТЕР
// =========================
const usersStore = useUsers()
const goodsStore = useGoods()
const router = useRouter()

// переход на главную страницу
function goHome() {
    router.push({ name: 'home' })
}

// =========================
// ШАГИ ОФОРМЛЕНИЯ ЗАКАЗА
// =========================
const step = ref(1)

// снимок заказа (используется на финальном шаге)
const order = ref(null)

// =========================
// КОРЗИНА
// =========================
// собираем товары из корзины пользователя + подтягиваем данные товаров
const cartItems = computed(() => {
    const cart = usersStore.currentUser.value?.cart || []

    return cart
        .map(item => {
            const product = goodsStore.getGoodsById(item.id)
            return product ? { ...product, quantity: item.quantity } : null
        })
        .filter(Boolean)
})

// =========================
// ОБЩАЯ СТОИМОСТЬ
// =========================
const totalPrice = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

// =========================
// ДАННЫЕ ПЛАТЕЖА
// =========================
const payment = ref({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: ''
})

// ошибки валидации
const errors = ref({})

// =========================
// ПЕРЕХОД К ОПЛАТЕ (ШАГ 1 → 2)
// =========================
function goToPayment() {
    errors.value = {}

    // если корзина пустая — блокируем переход
    if (!cartItems.value.length) {
        errors.value.cart = 'Корзина пуста — добавьте товары перед оплатой'
        return
    }

    step.value = 2
}

// =========================
// ВАЛИДАЦИЯ ПЛАТЁЖНЫХ ДАННЫХ
// =========================
function validatePayment() {
    errors.value = {}

    // очищаем пробелы в номере карты
    const card = payment.value.cardNumber.replace(/\s/g, '')

    // проверка номера карты
    if (!/^\d{16}$/.test(card)) {
        errors.value.cardNumber = 'Номер карты должен содержать 16 цифр'
    }

    const expiry = payment.value.expiry

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        errors.value.expiry = 'Введите срок в формате MM/YY'
    } else {
        const [mm, yy] = expiry.split('/').map(Number)

        const current = 26  
        const minMonth = 1
        const minYear = 26

        // базовая проверка месяца
        if (mm < 1 || mm > 12) {
            errors.value.expiry = 'Месяц должен быть 01–12'
        }


        const fullYear = yy < 100 ? yy : yy % 100

        if (fullYear < minYear) {
            errors.value.expiry = 'Срок карты не может быть раньше 01/26'
        }

        // если тот же год — проверяем месяц
        if (fullYear === minYear && mm < minMonth) {
            errors.value.expiry = 'Срок карты не может быть раньше 01/26'
        }
    }
    // проверка CVV
    if (!/^\d{3}$/.test(payment.value.cvv)) {
        errors.value.cvv = 'CVV должен содержать 3 цифры'
    }

    // проверка имени владельца
    if (!payment.value.name.trim()) {
        errors.value.name = 'Введите имя владельца карты'
    }

    // валидна ли форма
    return Object.keys(errors.value).length === 0
}

function formatExpiry(value) {
    // только цифры
    let v = value.replace(/\D/g, '').slice(0, 4)

    let mm = v.slice(0, 2)
    let yy = v.slice(2, 4)

    // ограничение месяца
    if (mm.length === 2) {
        let month = Number(mm)

        if (month < 1) month = 1
        if (month > 12) month = 12

        mm = String(month).padStart(2, '0')
    }


    if (v.length <= 2) return mm
    return `${mm}/${yy}`
}
// =========================
// ОФОРМЛЕНИЕ ЗАКАЗА
// =========================
function submitOrder() {
    // если не прошло валидацию — стоп
    if (!validatePayment()) return

    // создаём снимок заказа (что купили и на какую сумму)
    const snapshot = {
        items: cartItems.value.map(i => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity
        })),
        total: totalPrice.value
    }

    // сохраняем локально
    order.value = snapshot
    sessionStorage.setItem('order', JSON.stringify(snapshot))

    // создаём заказ в store пользователя
    const success = usersStore.createOrder()

    if (!success) {
        errors.value.cart = 'Не удалось оформить заказ'
        return
    }

    // переход на экран успеха
    step.value = 3
}

// =========================
// ВОЗВРАТ НА ПЕРВЫЙ ШАГ
// =========================
function goBack() {
    step.value = 1
}
</script>

<template>
    <div class="page-layout">
        <div class="main-content">
            <section class="checkout-section">

                <h2>Оформление заказа</h2>
                <p class="subtitle">Подтвердите покупку цифровых товаров</p>

                <!-- STEP 1 -->
                <div v-if="step === 1" class="step">

                    <div class="summary">
                        <h3>Ваш заказ</h3>

                        <div v-for="item in cartItems" :key="item.id" class="item">
                            <span>{{ item.title }} × {{ item.quantity }}</span>
                            <span>{{ item.price * item.quantity }} ₽</span>
                        </div>

                        <div class="total">
                            <strong>Итого:</strong>
                            <strong>{{ totalPrice }} ₽</strong>
                        </div>

                        <small v-if="errors.cart" class="error">
                            {{ errors.cart }}
                        </small>
                    </div>

                    <div class="actions">
                        <button class="pay-btn" @click="goToPayment">
                            Перейти к оплате
                        </button>

                        <button class="back-btn" @click="goBack">
                            Назад
                        </button>
                    </div>

                </div>

                <!-- STEP 2 -->
                <div v-else-if="step === 2" class="step">

                    <h3>Оплата</h3>

                    <div class="form-group">
                        <label>Номер карты</label>
                        <input v-model="payment.cardNumber" maxlength="16" />
                        <small class="error" v-if="errors.cardNumber">
                            {{ errors.cardNumber }}
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Срок действия</label>
                        <input :value="payment.expiry" @input="payment.expiry = formatExpiry($event.target.value)"
                            placeholder="MM/YY" maxlength="5" />
                        <small class="error" v-if="errors.expiry">
                            {{ errors.expiry }}
                        </small>
                    </div>

                    <div class="form-group">
                        <label>CVV</label>
                        <input v-model="payment.cvv" maxlength="3" />
                        <small class="error" v-if="errors.cvv">
                            {{ errors.cvv }}
                        </small>
                    </div>

                    <div class="form-group">
                        <label>Имя владельца</label>
                        <input v-model="payment.name" />
                        <small class="error" v-if="errors.name">
                            {{ errors.name }}
                        </small>
                    </div>

                    <div class="actions">
                        <button class="pay-btn" @click="submitOrder">
                            Подтвердить оплату
                        </button>

                        <button class="back-btn" @click="step = 1">
                            Назад
                        </button>
                    </div>

                </div>

                <!-- STEP 3: SUCCESS -->
                <div v-else-if="step === 3" class="step success">
                    <h3>Заказ оформлен</h3>

                    <p class="subtitle">
                        Спасибо за покупку! Лицензии уже доступны в вашем аккаунте.
                    </p>

                    <div class="summary">
                        <div v-for="item in order?.items" :key="item.id" class="item">
                            <span>{{ item.title }} × {{ item.quantity }}</span>
                            <span>{{ item.price * item.quantity }} ₽</span>
                        </div>

                        <div class="total">
                            <strong>Итого:</strong>
                            <strong>{{ order?.total }} ₽</strong>
                        </div>
                    </div>

                    <div class="actions">
                        <button class="pay-btn" @click="goHome">
                            Новый заказ
                        </button>
                    </div>
                </div>



            </section>
        </div>
    </div>


</template>

<style scoped>
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

/* ===== CARD ===== */
.checkout-section {
    width: 100%;
    max-width: 520px;

    display: flex;
    flex-direction: column;
    gap: 20px;

    background: #fff;
    padding: 32px;

    border-radius: 16px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}

/* ===== STEP WRAPPER ===== */
.step {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.subtitle {
    color: #6f7390;
    font-size: 14px;
    margin-top: -10px;
}

/* ===== SUMMARY ===== */
.summary {
    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 16px;

    border: 1px solid var(--border-light);
    border-radius: 12px;
    background: #fff;
}

.item {
    display: flex;
    justify-content: space-between;

    font-size: 14px;
    color: #333;
}

.total {
    display: flex;
    justify-content: space-between;

    font-size: 16px;
    font-weight: 600;

    margin-top: 6px;
}

/* ===== FORM ===== */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 14px;
    font-weight: 500;
    color: #1e1e1e;
}

.form-group input {
    padding: 10px 12px;

    border: 1px solid var(--border-light);
    border-radius: 10px;

    font-size: 14px;

    transition: 0.2s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

/* ===== ERRORS ===== */
.error {
    color: #e11d48;
    font-size: 12px;
}

/* ===== ACTIONS ===== */
.actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;
}

/* PRIMARY BUTTON */
.pay-btn {
    flex: 1;

    padding: 10px 16px;

    border: none;
    border-radius: 10px;

    cursor: pointer;

    font-weight: 500;
    color: #fff;

    background: var(--primary);

    transition: 0.2s ease;
}

.pay-btn:hover {
    background: var(--secondary);
    transform: translateY(-1px);
}

/* SECONDARY BUTTON */
.back-btn {
    padding: 10px 16px;

    border: 1px solid var(--border-light);
    border-radius: 10px;

    cursor: pointer;

    font-weight: 500;

    background: #fff;
    color: var(--text-main);

    transition: 0.2s ease;
}

.back-btn:hover {
    background: #f6f7fb;
    transform: translateY(-1px);
}
</style>