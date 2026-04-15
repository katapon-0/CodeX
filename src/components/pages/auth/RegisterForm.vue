<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '../../../composables/useUsers'

const router = useRouter()
const { addUser, userList } = useUsers()

// =========================
// FORM
// =========================
const userForm = ref({
  login: '',
  name: '',
  password: '',
  email: '',
  phone: '',
  birthdate: ''
})

const errors = ref({})

// =========================
// CONST
// =========================
const MIN_BIRTHDATE = new Date('2012-01-01')

// =========================
// EMAIL
// =========================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// =========================
// PHONE
// =========================
function validatePhone(phone) {
  if (!phone) return true
  return /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone)
}

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

// =========================
// VALIDATE
// =========================
function validate() {
  errors.value = {}

  const login = userForm.value.login?.trim()
  const name = userForm.value.name?.trim()
  const password = userForm.value.password?.trim()
  const email = userForm.value.email?.trim()
  const phone = userForm.value.phone?.trim()
  const birthdate = userForm.value.birthdate

  // LOGIN
  if (!login) {
    errors.value.login = 'Введите логин'
  }

  // NAME
  if (!name) {
    errors.value.name = 'Введите имя'
  }

  // PASSWORD (СТРОГО)
  if (!password) {
    errors.value.password = 'Введите пароль'
  } else if (password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов'
  }

  // EMAIL
  if (!email) {
    errors.value.email = 'Введите email'
  } else if (!validateEmail(email)) {
    errors.value.email = 'Неверный формат email'
  }

  // PHONE (ОБЯЗАТЕЛЬНЫЙ)
  if (!phone) {
    errors.value.phone = 'Введите телефон'
  } else if (!validatePhone(phone)) {
    errors.value.phone = 'Неверный формат телефона'
  }

  // BIRTHDATE
  if (!birthdate) {
    errors.value.birthdate = 'Введите дату рождения'
  } else {
    const birth = new Date(birthdate)

    if (isNaN(birth.getTime())) {
      errors.value.birthdate = 'Некорректная дата'
    } else if (birth > MIN_BIRTHDATE) {
      errors.value.birthdate = 'Дата рождения не может быть позже 01.01.2012'
    }
  }

  return Object.keys(errors.value).length === 0
}

// =========================
// LOGIN EXISTS CHECK (реалтайм)
// =========================
watch(() => userForm.value.login, (val) => {
  if (!val) {
    errors.value.login = ''
    return
  }

  const exists = userList.value.find(
    u => u.login.toLowerCase() === val.trim().toLowerCase()
  )

  errors.value.login = exists ? 'Такой логин уже существует' : ''
})

// =========================
// SUBMIT
// =========================
function submitForm() {
  if (!validate()) return

  const success = addUser({ ...userForm.value })

  if (!success) {
    errors.value.login = 'Пользователь с таким логином уже существует'
    return
  }

  router.push({ name: 'home' })

  userForm.value = {
    login: '',
    name: '',
    password: '',
    email: '',
    phone: '',
    birthdate: ''
  }
}

// =========================
// NAV
// =========================
function goLogin() {
  router.push({ name: 'login' })
}


</script>

<template>
  <div class="page-layout">
    <div class="main-content">
      <section class="auth-section">
        <h2>Регистрация нового пользователя</h2>
        <p>Заполните форму для создания аккаунта</p>

        <form @submit.prevent="submitForm" class="auth-form" novalidate>
          <div class="form-group">
            <label>Логин</label>
            <input v-model="userForm.login" type="text" placeholder="Введите логин" />
            <small class="error" v-if="errors.login">{{ errors.login }}</small>
            <small class="hint">Используйте латинские буквы и цифры</small>
          </div>

          <div class="form-group">
            <label>Имя</label>
            <input v-model="userForm.name" type="text" placeholder="Введите имя" />
            <small class="error" v-if="errors.name">{{ errors.name }}</small>
          </div>

          <div class="form-group">
            <label>Пароль</label>
            <input v-model="userForm.password" type="password" placeholder="Введите пароль" />
            <small class="error" v-if="errors.password">{{ errors.password }}</small>
            <small class="hint">Минимум 6 символов</small>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="userForm.email" type="email" placeholder="example@mail.ru" />
            <small class="error" v-if="errors.email">{{ errors.email }}</small>
          </div>

          <div class="form-group">
            <label>Телефон (опционально)</label>
            <input :value="userForm.phone" @input="userForm.phone = formatPhone($event.target.value)" type="text"
              placeholder="+7(XXX)XXX-XX-XX" maxlength="16" />
            <small class="error" v-if="errors.phone">{{ errors.phone }}</small>
          </div>

          <div class="form-group">
            <label>Дата рождения</label>
            <input v-model="userForm.birthdate" type="date" />
            <small class="error" v-if="errors.birthdate">{{ errors.birthdate }}</small>
          </div>

          <div class="form-actions">
            <button type="submit" class="add-to-cart-btn primary">
              Зарегистрироваться
            </button>

            <button type="button" class="add-to-cart-btn secondary" @click="goLogin">
              Вход
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
   ТЕКСТ
   ========================= */
.auth-section h2 {
  margin: 0;
}

.auth-section p {
  margin: 0;
  color: #666;
  font-size: 14px;
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

.form-group label {
  font-weight: 500;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  border-color: #0f101d;
  box-shadow: 0 0 0 2px rgba(15, 16, 29, 0.08);
}

/* =========================
   ОШИБКИ
   ========================= */
.error {
  color: red;
  font-size: 12px;
}

.hint {
  color: #888;
  font-size: 12px;
}

/* =========================
   КНОПКИ (как в loginform)
   ========================= */
.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.add-to-cart-btn {
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: 0.2s;
}

/* PRIMARY — "Зарегистрироваться" */
.add-to-cart-btn.primary {
  background-color: #0f101d;
  color: #fff;
}

.add-to-cart-btn.primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

/* SECONDARY — "Вход" */
.add-to-cart-btn.secondary {
  background-color: var(--bg-color);
  color: black;
  transform: none;
  box-shadow: none;
}

.add-to-cart-btn.secondary:hover {
  background-color: var(--bg-color);
  color: rgb(69, 69, 69);
  transition: 0.3s;

}
</style>