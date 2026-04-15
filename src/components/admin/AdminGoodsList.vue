<script setup>
// =========================
// ИМПОРТЫ
// =========================
import { ref } from "vue"
import { useGoods } from "../../composables/useGoods"


// =========================
// STORE ТОВАРОВ
// =========================
const { goods, deleteGoods } = useGoods()


// =========================
// СОСТОЯНИЕ ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ
// =========================
const pendingDeleteId = ref(null)


// =========================
// ФУНКЦИИ
// =========================

// ОТКРЫТЬ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ
function confirmDelete(id) {
  pendingDeleteId.value = id
}

// УДАЛИТЬ ТОВАР
function removeProduct(id) {
  deleteGoods(id)
  pendingDeleteId.value = null
}
</script>

<template>
  <div class="admin-list">
    <h2>Список товаров</h2>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="product in goods" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.title }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price }} ₽</td>

          <td class="actions">
            <router-link :to="{ name: 'admin-edit', params: { id: product.id } }">
              <button class="accent">Редактировать</button>
            </router-link>

            <button class="delete" @click="confirmDelete(product.id)">
              Удалить
            </button>

            <div v-if="pendingDeleteId === product.id" class="confirm-delete">
              <span>Подтвердите удаление?</span>
              <button class="confirm" @click="removeProduct(product.id)">Да</button>
              <button class="cancel" @click="pendingDeleteId = null">Нет</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* =========================
   КОНТЕЙНЕР СПИСКА
   ========================= */
.admin-list {
  background: #ffffff;
  padding: 28px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  overflow: visible;
}

.admin-list h2 {
  margin: 0 0 18px 0;
  font-weight: 600;
}


/* =========================
   ТАБЛИЦА
   ========================= */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

 
th,
td {
  padding: 12px 14px;
  text-align: left;
}

th {
  background: var(--table-color-hz);
  color: var(--primary);
  font-weight: 600;
}

tbody tr {
  background: #fff;
  border-radius: 12px;
}

tbody td {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

tbody tr td:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

tbody tr td:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}


/* =========================
   КНОПКА РЕДАКТИРОВАНИЯ
   ========================= */
button.accent {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  margin-right: 6px;
}


/* =========================
   КНОПКА УДАЛЕНИЯ
   ========================= */
button.delete {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background-color: #b03030;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;
}

button.delete:hover {
  background-color: #800000;
}


/* =========================
   ДЕЙСТВИЯ
   ========================= */
.actions {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: visible;
}


/* =========================
   ОКНО ПОДТВЕРЖДЕНИЯ
   ========================= */
.confirm-delete {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;

  background: #fff;
  border: 1px solid rgba(176, 48, 48, 0.25);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);

  padding: 10px 12px;
  border-radius: 10px;

  display: flex;
  gap: 8px;
  align-items: center;

  z-index: 20;
  white-space: nowrap;
}

.confirm-delete span {
  color: #b03030;
  font-weight: 500;
  font-size: 14px;
}

.confirm-delete button {
  padding: 4px 9px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease;
}

.confirm-delete .confirm {
  background-color: #b03030;
  color: #fff;
}

.confirm-delete .confirm:hover {
  background-color: #800000;
}

.confirm-delete .cancel {
  background-color: #e0e0e0;
  color: #333;
}

.confirm-delete .cancel:hover {
  background-color: #c8c8c8;
}
</style>