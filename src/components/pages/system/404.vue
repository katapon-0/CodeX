<script setup>
// =========================
// 404 СТРАНИЦА (NOT FOUND)
// =========================
</script>

<template>
  <!-- =========================
       ОСНОВНОЙ LAYOUT СТРАНИЦЫ
       ========================= -->
  <div class="home-layout">

    <div class="main-content">

      <!-- =========================
           БЛОК "СТРАНИЦА НЕ НАЙДЕНА"
           ========================= -->
      <section class="not-found-section">

        <!-- код ошибки -->
        <h1>404</h1>

        <!-- основное сообщение пользователю -->
        <p class="text-main">
          Упс! Страница, которую вы ищете, не найдена.
        </p>

        <!-- поясняющий текст (справка о 404) -->
        <p class="text-note">
          <b>Примечание от Mozilla Developer:</b> <br/>
          Код ответа на ошибку HTTP 404 Not Found указывает, что сервер не может найти запрошенный ресурс. <br/>
          Ссылки, ведущие к коду 404, часто называются сломанными или мёртвыми связями и приводят к ссылочной гнили. <br/><br/>
          Многие веб-сайты настраивают внешний вид страницы 404, <br/>
          чтобы быть более полезными для пользователя и давать рекомендации.
        </p>

        <!-- кнопка возврата на главную страницу -->
        <router-link to="/" class="back-home-btn">
          Вернуться на главную
        </router-link>

      </section>
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  gap: 24px;
  padding: 16px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

/* =========================
   КАРТОЧКА 404
   ========================= */
.not-found-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 60px 20px;

  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: var(--hover-color-card);

  text-align: center;
  gap: 16px;
}

/* =========================
   КОД ОШИБКИ
   ========================= */
.not-found-section h1 {
  font-size: 72px;
  font-weight: 700;
}

/* =========================
   ОСНОВНОЙ ТЕКСТ
   ========================= */
.not-found-section .text-main {
  font-size: 18px;
}

/* =========================
   ДОПОЛНИТЕЛЬНОЕ ПРИМЕЧАНИЕ
   ========================= */
.text-note {
  font-size: 12px;
}

/* =========================
   КНОПКА ВОЗВРАТА
   ========================= */
.back-home-btn {
  display: inline-block;
  padding: 10px 20px;

  background-color: var(--secondary);
  color: white;

  border-radius: 8px;

  transition: 0.2s;
}

.back-home-btn:hover {
  background-color: var(--accent);
}
</style>