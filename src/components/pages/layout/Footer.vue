<script setup>
// =========================
// БАЗОВЫЕ ИМПОРТЫ
// =========================
import { useRouter } from 'vue-router'

// =========================
// ROUTER
// =========================
const router = useRouter()

// =========================
// ФУНКЦИИ ПЕРЕХОДА
// =========================

// ПЕРЕХОД В КАТЕГОРИЮ
function goToCategory(cat) {
  router.push({ name: 'category', params: { slug: cat.slug } })
}

// ПЕРЕХОД НА ГЛАВНУЮ
function goToHome() {
  router.push({ name: 'home' })
}

// ОТКРЫТИЕ ВНЕШНЕЙ ССЫЛКИ
function openSocial(url) {
  window.open(url, '_blank')
}

// =========================
// ДАННЫЕ ФУТЕРА
// =========================
const footerCategories = [
  { id: 1, title: 'Офисные продукты', slug: 'office' },
  { id: 2, title: 'ОС Windows', slug: 'windows-os' },
  { id: 3, title: 'Игры', slug: 'games' },
  { id: 4, title: 'Антивирусы', slug: 'antivirus' }
]

const socials = [
  { title: 'VK', url: 'https://vk.com' },
  { title: 'Telegram', url: 'https://t.me' },
  { title: 'YouTube', url: 'https://youtube.com' }
]
</script>

<template>
  <footer class="footer-bar">
    <div class="footer-container">

      <!-- =========================
           БЛОК О КОМПАНИИ
           ========================= -->
      <div class="footer-block">
        <h4>О компании</h4>
        <p>
          Мы продаём софт для дома и бизнеса. Наша миссия — сделать цифровую жизнь проще и удобнее.
        </p>

        <button class="footer-btn" @click="goToHome">
          На главную
        </button>
      </div>

      <!-- =========================
           КАТЕГОРИИ
           ========================= -->
      <div class="footer-block">
        <h4>Категории</h4>

        <ul>
          <li v-for="cat in footerCategories" :key="cat.id">
            <button class="footer-link-btn" @click="goToCategory(cat)">
              {{ cat.title }}
            </button>
          </li>
        </ul>
      </div>

      <!-- =========================
           КОНТАКТЫ
           ========================= -->
      <div class="footer-block">
        <h4>Контакты</h4>
        <p>Телефон: <a href="tel:+70000000000">+7(000)000-00-00</a></p>
        <p>Email: <a href="mailto:agp@edu.ru">agp@edu.ru</a></p>
        <p>Адрес: г. Санкт-Петербург, ул. Руставели, дом 37</p>
      </div>

      <!-- =========================
           СОЦСЕТИ
           ========================= -->
      <div class="footer-block">
        <h4>Мы в соцсетях</h4>

        <ul class="social-links">
          <li v-for="s in socials" :key="s.title">
            <button class="footer-link-btn" @click="openSocial(s.url)">
              {{ s.title }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- =========================
         НИЖНЯЯ ПОЛОСА
         ========================= -->
    <div class="footer-bottom">
      &copy; 2026.
    </div>
  </footer>
</template>

<style scoped>

/* =========================
   ОСНОВНОЙ ФУТЕР
   ========================= */
.footer-bar {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  font-family: var(--font-text);
  padding: 28px 24px 18px;
}

/* =========================
   КОНТЕЙНЕР
   ========================= */
.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  align-items: stretch;
}

/* =========================
   БЛОКИ ФУТЕРА
   ========================= */
.footer-block {
  background: #ffffff;
  border-radius: 14px;
  padding: 16px 18px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.footer-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

/* =========================
   ЗАГОЛОВКИ
   ========================= */
.footer-block h4 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: var(--primary);
}

/* =========================
   ТЕКСТ
   ========================= */
.footer-block p,
.footer-block li {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.75);
}

/* =========================
   СПИСКИ
   ========================= */
.footer-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* =========================
   КНОПКИ / ССЫЛКИ
   ========================= */
.footer-link-btn,
.footer-btn {
  background: transparent;
  border: none;
  padding: 6px 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  transition: 0.2s ease;
}

.footer-link-btn:hover,
.footer-btn:hover {
  background: var(--hover-color);
  color: #000;
}

/* =========================
   ССЫЛКИ
   ========================= */
.footer-block a {
  color: inherit;
  text-decoration: none;
}

.footer-block a:hover {
  text-decoration: underline;
}

/* =========================
   СОЦСЕТИ
   ========================= */
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* =========================
   НИЖНЯЯ ПОЛОСА
   ========================= */
.footer-bottom {
  margin-top: 20px;
  padding-top: 12px;
  text-align: center;
  font-size: 12px;
  opacity: 0.7;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
</style>
