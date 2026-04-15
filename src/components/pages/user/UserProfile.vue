<script setup>
import { ref, watch, computed } from 'vue'
import { useUsers } from '../../../composables/useUsers'

const { currentUser, editUser } = useUsers()

// =========================
// UI STATE
// =========================
const isEditing = ref(false)
const activeTab = ref('profile')
const editedUser = ref({ ...(currentUser.value || {}) })
const notification = ref('')

// =========================
// ERRORS
// =========================
const errors = ref({
    name: '',
    password: '',
    email: '',
    phone: '',
    birthdate: ''
})

// =========================
// PHONE MASK
// =========================
function formatPhone(value) {
    let numbers = (value || '').replace(/\D/g, '')

    if (numbers.startsWith('7')) {
        numbers = numbers.slice(1)
    }

    numbers = numbers.slice(0, 10)

    let result = '+7'

    if (numbers.length > 0) result += '(' + numbers.slice(0, 3)
    if (numbers.length >= 3) result += ')'
    if (numbers.length > 3) result += numbers.slice(3, 6)
    if (numbers.length >= 6) result += '-' + numbers.slice(6, 8)
    if (numbers.length >= 8) result += '-' + numbers.slice(8, 10)

    return result
}


const MIN_BIRTHDATE = new Date('2012-01-01')

// =========================
// VALIDATION  
// =========================
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '')
}

function validatePhone(phone) {
    if (!phone) return true
    return /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)
}

function validateBirthdate(date) {
    if (!date) return true

    const birth = new Date(date)

    if (isNaN(birth.getTime())) return false

    return birth <= MIN_BIRTHDATE
}

// =========================
// RESET ERRORS
// =========================
function resetErrors() {
    errors.value = {
        name: '',
        password: '',
        email: '',
        phone: '',
        birthdate: ''
    }
}

// =========================
// EDIT FLOW
// =========================
function startEditing() {
    editedUser.value = { ...currentUser.value }
    isEditing.value = true
    notification.value = ''
    resetErrors()
}

function cancelEditing() {
    isEditing.value = false
    resetErrors()
}

// =========================
// SAVE
// =========================
function saveChanges() {
    resetErrors()

    let valid = true

    const u = editedUser.value

    // NAME
    if (!u.name?.trim()) {
        errors.value.name = 'Имя не может быть пустым'
        valid = false
    }

    // PASSWORD
    if (!u.password?.trim()) {
        errors.value.password = 'Пароль не может быть пустым'
        valid = false
    }

    // EMAIL
    if (!validateEmail(u.email)) {
        errors.value.email = 'Неверный формат email'
        valid = false
    }

    // PHONE 
    if (u.phone && !validatePhone(u.phone)) {
        errors.value.phone = 'Неверный формат телефона'
        valid = false
    }

    // BIRTHDATE
    if (u.birthdate && !validateBirthdate(u.birthdate)) {
        errors.value.birthdate = 'Дата рождения не может быть позже 01.01.2012'
        valid = false
    }

    if (!valid) return

    editUser(currentUser.value.login, { ...u })

    notification.value = 'Изменения сохранены'
    isEditing.value = false
}

// =========================
// SYNC
// =========================
watch(currentUser, (newVal) => {
    if (!isEditing.value) {
        editedUser.value = { ...newVal }
    }
})

// =========================
// MOCK ORDERS
// =========================
const orders = computed(() => currentUser.value?.orders ?? [])



</script>

<template>
    <div class="profile-page">

        <!-- HEADER -->
        <div class="profile-header">
            <h2>Личный кабинет</h2>

            <div class="tabs">
                <button :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
                    Профиль
                </button>

                <button :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
                    Заказы
                </button>
            </div>
        </div>

        <p v-if="notification" class="notification">
            {{ notification }}
        </p>

        <!-- PROFILE -->
        <div v-if="activeTab === 'profile'">

            <div v-if="!isEditing" class="card">
                <p><strong>Логин:</strong> {{ currentUser.login }}</p>
                <p><strong>Имя:</strong> {{ currentUser.name }}</p>
                <p><strong>Email:</strong> {{ currentUser.email }}</p>
                <p><strong>Телефон:</strong> {{ currentUser.phone || '-' }}</p>
                <p><strong>Дата рождения:</strong> {{ currentUser.birthdate || '-' }}</p>
                <p><strong>Роль:</strong> {{ currentUser.role }}</p>

                <button @click="startEditing">Редактировать</button>
            </div>

            <div v-else class="card edit">

                <input v-model="editedUser.name" placeholder="Имя" />
                <small class="error">{{ errors.name }}</small>

                <input v-model="editedUser.password" placeholder="Пароль" />
                <small class="error">{{ errors.password }}</small>

                <input v-model="editedUser.email" placeholder="Email" />
                <small class="error">{{ errors.email }}</small>

                <input :value="editedUser.phone" @input="editedUser.phone = formatPhone($event.target.value)"
                    placeholder="+7(XXX)XXX-XX-XX" maxlength="16" />
                <small class="error">{{ errors.phone }}</small>

                <input v-model="editedUser.birthdate" type="date" />
                <small class="error">{{ errors.birthdate }}</small>

                <div class="actions">
                    <button @click="saveChanges">Сохранить</button>
                    <button @click="cancelEditing">Отмена</button>
                </div>

            </div>

        </div>

        <!-- ORDERS -->
        <div v-else-if="activeTab === 'orders'" class="orders">

            <div v-if="orders.length" class="orders-list">

                <div v-for="order in orders" :key="order.id" class="order-card">

                    <div class="order-head">
                        <strong>Заказ #{{ order.id }}</strong>
                        <span class="status">{{ order.status }}</span>
                    </div>

                    <p class="muted">Дата: {{ order.date }}</p>

                    <div class="items">
                        <div v-for="item in order.items" :key="item.title" class="item">
                            {{ item.title }} — {{ item.price }} ₽
                        </div>
                    </div>

                    <div class="total">
                        Итого: {{ order.total }} ₽
                    </div>

                </div>

            </div>

            <div v-else class="empty">
                <p>У вас пока нет заказов</p>
            </div>

        </div>

    </div>
</template>

<style scoped>
.profile-page {
    max-width: 800px;
    margin: 30px auto;
    padding: 20px;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.tabs {
    display: flex;
    gap: 10px;
}

.tabs button {
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

.tabs .active {
    background: #111;
    color: white;
}

.card {
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.card input {
    width: 100%;
    margin-bottom: 8px;
    padding: 8px;
    border-radius: 8px;
}

.actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.notification {
    color: #28a745;
    margin-bottom: 10px;
}

.error {
    color: #d9534f;
    font-size: 12px;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.order-card {
    background: #fff;
    padding: 14px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.order-head {
    display: flex;
    justify-content: space-between;
}

.status {
    font-size: 12px;
    color: #555;
}

.muted {
    color: #777;
    font-size: 13px;
}

.items {
    margin-top: 8px;
}

.total {
    margin-top: 10px;
    font-weight: bold;
}

.empty {
    padding: 20px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
}
</style>