<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { ref } from "vue"
import { useRoute } from "vue-router"
import { useGoods } from "../../composables/useGoods"

// =========================
// STORE И РОУТ
// =========================
const { goods, updateGoods, getCategories } = useGoods()
const route = useRoute()

// =========================
// ДАННЫЕ КАТЕГОРИЙ
// =========================
const categories = getCategories().value

// =========================
// ПОЛУЧЕНИЕ ТОВАРА ПО ID
// =========================
const id = Number(route.params.id)
const product = goods.value.find(g => g.id === id)

// =========================
// РЕАКТИВНЫЕ ПОЛЯ ФОРМЫ
// =========================
const title = ref(product?.title || "")
const category = ref(product?.category || categories[0]?.title)
const price = ref(product?.price || 0)
const description = ref(product?.description || "")
const image = ref(product?.image || "")

// =========================
// СОСТОЯНИЕ ОШИБОК И УСПЕХА
// =========================
const errors = ref({})
const successMessage = ref("")

// =========================
// ВАЛИДАЦИЯ ФОРМЫ
// =========================
function validate() {
  errors.value = {}

  if (!title.value.trim()) {
    errors.value.title = "Введите название товара"
  }

  if (!category.value) {
    errors.value.category = "Выберите категорию"
  }

  if (price.value === null || price.value === "" || price.value < 0) {
    errors.value.price = "Введите корректную цену"
  }

  if (!description.value.trim()) {
    errors.value.description = "Введите описание товара"
  }

  return Object.keys(errors.value).length === 0
}

// =========================
// СОХРАНЕНИЕ ИЗМЕНЕНИЙ
// =========================
function saveProduct() {
  successMessage.value = ""

  if (!validate()) return

  updateGoods(id, {
    title: title.value,
    category: category.value,
    price: price.value,
    description: description.value,
    image: image.value
  })

  successMessage.value = "Товар успешно обновлён"
}
</script>

<template>
  <!-- =========================
       ОСНОВНОЙ КОНТЕЙНЕР
       ========================= -->
  <div class="admin-edit">

    <h2>Редактирование товара</h2>

    <!-- =========================
         ФОРМА РЕДАКТИРОВАНИЯ
         ========================= -->
    <form @submit.prevent="saveProduct" novalidate>

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
           КНОПКА СОХРАНЕНИЯ
           ========================= -->
      <button type="submit" class="accent">
        Сохранить
      </button>

    </form>
  </div>
</template>

<style scoped>
/* =========================
   КАРТОЧКА РЕДАКТИРОВАНИЯ
   ========================= */
.admin-edit {
  max-width: 640px;
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}

/* =========================
   ГРУППЫ ПОЛЕЙ
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