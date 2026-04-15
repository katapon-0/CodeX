<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '../../../composables/useUsers'


// =========================
// ROUTER
// =========================
const router = useRouter()


// =========================
// STORE (ПОЛЬЗОВАТЕЛИ)
// =========================
const UsersList = useUsers()
const { loginUser, logoutUser, currentUser } = UsersList


// =========================
// СОСТОЯНИЕ ФОРМЫ
// =========================
const login = ref('')
const password = ref('')
const errors = ref({})


// =========================
// COMPUTED
// =========================

// ТЕКУЩИЙ ПОЛЬЗОВАТЕЛЬ
const user = computed(() => currentUser.value)


// =========================
// ФУНКЦИИ
// =========================

// ВАЛИДАЦИЯ ФОРМЫ
function validate() {
  errors.value = {}

  if (!login.value.trim()) {
    errors.value.login = 'Введите логин'
  }

  if (!password.value.trim()) {
    errors.value.password = 'Введите пароль'
  }

  return Object.keys(errors.value).length === 0
}


// ОТПРАВКА ФОРМЫ (ЛОГИН)
function submitForm() {
  if (!validate()) return

  const success = loginUser(login.value, password.value)

  if (!success) {
    errors.value.general = 'Неверный логин или пароль'
    return
  }

  router.push({ name: 'home' })
}


// ПЕРЕХОД НА ГЛАВНУЮ
function goBack() {
  router.push({ name: 'home' })
}


// ПЕРЕХОД НА РЕГИСТРАЦИЮ
function goRegister() {
  router.push({ name: 'register' })
}


// ВЫХОД ИЗ АККАУНТА
function handleLogout() {
  logoutUser()
}
</script>

<template>
  <div class="page-layout">
    <div class="main-content">

      <!-- =========================
           СЕКЦИЯ АВТОРИЗАЦИИ
           ========================= -->
      <section class="auth-section">
        <h2>Вход в аккаунт</h2>


        <!-- =========================
             ЕСЛИ ПОЛЬЗОВАТЕЛЬ УЖЕ ВОШЁЛ
             ========================= -->
        <div v-if="user" class="logged-in">
          <p>
            Вы вошли как <strong>{{ user.login }}</strong>
          </p>

          <div class="logged-buttons">
            <button class="add-to-cart-btn accent" @click="goBack">
              На главную
            </button>

            <button class="add-to-cart-btn" @click="handleLogout">
              Выйти
            </button>
          </div>
        </div>


        <!-- =========================
             ФОРМА ВХОДА
             ========================= -->
        <form v-else @submit.prevent="submitForm" class="auth-form" novalidate>

          <!-- ЛОГИН -->
          <div class="form-group">
            <label>Логин</label>

            <input v-model="login" type="text" placeholder="Введите логин" />

            <small class="error" v-if="errors.login">
              {{ errors.login }}
            </small>
          </div>


          <!-- ПАРОЛЬ -->
          <div class="form-group">
            <label>Пароль</label>

            <input v-model="password" type="password" placeholder="Введите пароль" />

            <small class="error" v-if="errors.password">
              {{ errors.password }}
            </small>
          </div>


          <!-- ОБЩАЯ ОШИБКА -->
          <div class="form-group">
            <small class="error" v-if="errors.general">
              {{ errors.general }}
            </small>
          </div>


          <!-- КНОПКИ -->
          <div class="form-actions">
            <button type="submit" class="add-to-cart-btn accent">
              Войти
            </button>

            <button type="button" class="add-to-cart-btn-register" @click="goRegister">
              Регистрация
            </button>
          </div>

        </form>
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
   СЕКЦИЯ АВТОРИЗАЦИИ
   ========================= */
.auth-section {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
}


/* =========================
   ФОРМА
   ========================= */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}


/* =========================
   ОШИБКИ
   ========================= */
.error {
  color: red;
  font-size: 12px;
}


/* =========================
   КНОПКИ
   ========================= */
.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.add-to-cart-btn-register {
  background-color: var(--bg-color);
  color: black;
  transform: none;
  box-shadow: none;
}

.add-to-cart-btn-register:hover {
  background-color: var(--bg-color);
  color: rgb(69, 69, 69);
  transition: 0.3s;

}

/* =========================
   СОСТОЯНИЕ "УЖЕ ВОШЁЛ"
   ========================= */
.logged-in {
  padding: 16px;
  border-radius: 16px;
  text-align: center;
}

.logged-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 12px;
}
</style>