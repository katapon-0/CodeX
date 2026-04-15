<script setup>
// приветственный экран админки
</script>

<template>
  <!-- =========================
       ПРИВЕТСТВЕННЫЙ ЭКРАН АДМИНКИ
       ========================= -->
  <section class="admin-welcome">
    <h2>Добро пожаловать, Админ!</h2>

    <p>
      Здесь вы управляете товарами вашего магазина. Используйте меню слева для навигации:
    </p>

    <ul>
      <li><strong>Список товаров</strong> — просмотр и редактирование товаров.</li>
      <li><strong>Добавить товар</strong> — создание нового продукта.</li>
    </ul>

    <p>
      Вы можете редактировать данные и поддерживать актуальность каталога.
    </p>
  </section>

  <!-- =========================
       ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ
       ========================= -->
  <section class="admin-info">
    <h3>Советы по работе</h3>

    <ol>
      <li>Регулярно обновляйте товары.</li>
      <li>Добавляйте новые продукты своевременно.</li>
      <li>Следите за актуальностью данных.</li>
    </ol>
  </section>
</template>

<style scoped>
.admin-panel {
  display: flex;
  min-height: 80vh;
  font-family: var(--font-text);
  gap: 0;
}


.sidebar {
  width: 220px;
  background-color: var(--bg-main);
  padding: 24px 16px;
  position: relative;
  z-index: 5;
}

.sidebar h3 {
  margin-bottom: 24px;
  color: var(--primary);
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}


.nav-link {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--primary);
  font-weight: 500;
  text-decoration: none;
  transition: 0.2s;
  pointer-events: auto;
}

.nav-link.active {
  color: black;
}

.nav-link:hover {
  background-color: var(--accent);
  color: rgb(255, 255, 255);
}

.admin-main {
  flex: 1;
  padding: 24px;
  position: relative;
  z-index: 1;
}
</style>