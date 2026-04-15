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

  if (!userForm.value.login) errors.value.login = 'Введите логин'
  if (!userForm.value.name) errors.value.name = 'Введите имя'
  if (!userForm.value.password) errors.value.password = 'Введите пароль'

  // EMAIL
  if (!userForm.value.email) {
    errors.value.email = 'Введите email'
  } else if (!validateEmail(userForm.value.email)) {
    errors.value.email = 'Неверный формат email'
  }

  // PHONE (optional)
  if (userForm.value.phone && !validatePhone(userForm.value.phone)) {
    errors.value.phone = 'Неверный формат телефона'
  }

  // BIRTHDATE (обязательная)
  if (!userForm.value.birthdate) {
    errors.value.birthdate = 'Введите дату рождения'
  } else {
    const birth = new Date(userForm.value.birthdate)

    if (birth > MIN_BIRTHDATE) {
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
function goBack() {
  router.push({ name: 'home' })
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
            <button type="submit" class="add-to-cart-btn accent">Зарегистрироваться</button>
            <button type="button" class="add-to-cart-btn" @click="goBack">На главную</button>
          </div>
        </form>
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

.error {
  color: red;
  font-size: 12px;
}

.hint {
  color: #888;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.add-to-cart-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #fff;
  background-color: var(--secondary);
  transition: background 0.2s;
}
</style>