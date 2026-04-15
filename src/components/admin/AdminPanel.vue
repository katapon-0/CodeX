<script setup>
// админ панель layout
</script>

<template>
  <!-- =========================
       ОСНОВНОЙ LAYOUT АДМИНКИ
       ========================= -->
  <div class="admin-panel">

    <!-- =========================
         SIDEBAR НАВИГАЦИЯ
         ========================= -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <h3 class="sidebar-title">Админ-панель</h3>

        <nav class="nav">
          <router-link
            :to="{ name: 'admin-list' }"
            class="nav-link"
            active-class="active"
          >
            Список товаров
          </router-link>

          <router-link
            :to="{ name: 'admin-add' }"
            class="nav-link"
            active-class="active"
          >
            Добавить товар
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- =========================
         MAIN CONTENT AREA
         ========================= -->
    <main class="admin-main">
      <router-view :key="$route.fullPath" />
    </main>

  </div>
</template>

<style scoped>
/* =========================
   LAYOUT
   ========================= */
.admin-panel {
  display: flex;
  min-height: 80vh;
  font-family: var(--font-text);
  gap: 16px;
  padding: 16px;
  background: transparent;
}

/* =========================
   SIDEBAR 
   ========================= */
.sidebar {
  width: 240px;
  padding: 16px;
}

.sidebar-inner {
  padding: 14px;
  border-radius: 12px;

  background: transparent;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

/* =========================
   TITLE
   ========================= */
.sidebar-title {
  margin: 0 0 12px 0;
  font-weight: 600;
  cursor: default;
}

/* =========================
   NAV
   ========================= */
.nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* =========================
   LINK 
   ========================= */
.nav-link {
  display: flex;
  align-items: center;

  padding: 8px 12px;
  border-radius: 10px;

  text-decoration: none;
  color: inherit;
  font-weight: 500;

  transition: 0.18s ease;
}

.nav-link:hover {
  background-color: var(--hover-color);
}

.nav-link.active {
  background-color: var(--hover-color);
  color: #000;
}

/* =========================
   MAIN CONTENT
   ========================= */
.admin-main {
  flex: 1;
  padding: 18px;
}
</style>