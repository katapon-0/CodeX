<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { ref } from "vue"
import { useGoods } from "../../composables/useGoods"


// =========================
// STORE ТОВАРОВ И КАТЕГОРИЙ
// =========================
const { addGoods, getCategories } = useGoods()
const categories = getCategories().value


// =========================
// РЕАКТИВНЫЕ ПОЛЯ ФОРМЫ
// =========================
const title = ref("")
const category = ref(categories[0]?.title || "")
const price = ref(0)
const description = ref("")
const image = ref("")


// =========================
// СОСТОЯНИЯ ОШИБОК И УСПЕХА
// =========================
const errors = ref({})
const successMessage = ref("")


// =========================
// ВАЛИДАЦИЯ ФОРМЫ
// =========================
function validate() {
  errors.value = {}

  // проверка названия
  if (!title.value.trim()) {
    errors.value.title = "Введите название товара"
  }

  // проверка категории
  if (!category.value) {
    errors.value.category = "Выберите категорию"
  }

  // проверка цены
  if (price.value === null || price.value === "" || price.value <= 0) {
    errors.value.price = "Введите корректную цену"
  }

  // проверка описания
  if (!description.value.trim()) {
    errors.value.description = "Введите описание товара"
  }

  // форма валидна, если нет ошибок
  return Object.keys(errors.value).length === 0
}


// =========================
// ДОБАВЛЕНИЕ ТОВАРА
// =========================
function addProduct() {
  successMessage.value = ""

  // если форма не прошла валидацию — стоп
  if (!validate()) return

  // добавление товара в store
  addGoods({
    title: title.value,
    category: category.value,
    price: price.value,
    description: description.value,
    image: image.value
  })

  // сообщение об успехе
  successMessage.value = "Товар успешно добавлен"
}
</script>

<template>
  <!-- =========================
       ОСНОВНОЙ КОНТЕЙНЕР ФОРМЫ
       ========================= -->
  <div class="admin-add">
    <h2>Добавить новый товар</h2>

    <!-- =========================
         ФОРМА ДОБАВЛЕНИЯ
         ========================= -->
    <form @submit.prevent="addProduct" novalidate>

      <!-- =========================
           НАЗВАНИЕ
           ========================= -->
      <div class="form-group">
        <label>Название</label>
        <input v-model="title" />
        <small class="error" v-if="errors.title">{{ errors.title }}</small>
      </div>

      <!-- =========================
           КАТЕГОРИЯ
           ========================= -->
      <div class="form-group">
        <label>Категория</label>
        <select v-model="category">
          <option v-for="cat in categories" :key="cat.id" :value="cat.title">
            {{ cat.title }}
          </option>
        </select>
        <small class="error" v-if="errors.category">{{ errors.category }}</small>
      </div>

      <!-- =========================
           ЦЕНА
           ========================= -->
      <div class="form-group">
        <label>Цена (₽)</label>
        <input type="number" v-model.number="price" min="0" />
        <small class="error" v-if="errors.price">{{ errors.price }}</small>
      </div>

      <!-- =========================
           ОПИСАНИЕ
           ========================= -->
      <div class="form-group">
        <label>Описание</label>
        <textarea v-model="description"></textarea>
        <small class="error" v-if="errors.description">{{ errors.description }}</small>
      </div>

      <!-- =========================
           СООБЩЕНИЕ ОБ УСПЕХЕ
           ========================= -->
      <small class="success" v-if="successMessage">
        {{ successMessage }}
      </small>

      <!-- =========================
           КНОПКА ОТПРАВКИ
           ========================= -->
      <button type="submit" class="accent">
        Добавить товар
      </button>

    </form>
  </div>
</template>

<style scoped>
/* =========================
   КАРТОЧКА ФОРМЫ
   ========================= */
.admin-add {
  max-width: 640px;
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

/* =========================
   ГРУППА ПОЛЕЙ
   ========================= */
.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

/* =========================
   ЛЕЙБЛЫ
   ========================= */
label {
  font-weight: 600;
  margin-bottom: 6px;
}

/* =========================
   ПОЛЯ ВВОДА
   ========================= */
input,
select,
textarea {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.08);
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

/* =========================
   ОШИБКИ
   ========================= */
small.error {
  color: #d93025;
  margin-top: 4px;
}

/* =========================
   УСПЕХ
   ========================= */
small.success {
  display: block;
  margin: 10px 0 14px;
  color: #1c9c3c;
  font-weight: 500;
}

/* =========================
   КНОПКА
   ========================= */
button.accent {
  padding: 10px 16px;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  background: var(--accent, #111);
  color: #fff;
  transition: 0.2s;
}

button.accent:hover {
  opacity: 0.9;
}
</style>