import { ref, watch } from "vue"

// =========================
// ИМПОРТ ИЗОБРАЖЕНИЙ
// =========================

import img from '../assets/img_for_cards/plug.png'
import win10home from "../assets/img_for_cards/win10home.png"
import win10pro from "../assets/img_for_cards/win10pro.png"
import win10ent from "../assets/img_for_cards/win10ent.png"
import win11home from "../assets/img_for_cards/win11home.png"
import win11pro from "../assets/img_for_cards/win11pro.png"
import win11ent from "../assets/img_for_cards/win11ent.png"
import ms365sem from "../assets/img_for_cards/ms365sem.png"
import winserstand from "../assets/img_for_cards/winserstand.png"
import office from "../assets/img_for_categories/office.png"
import msOS from "../assets/img_for_categories/msOS.png"
import games from "../assets/img_for_categories/games.png"
import antivirus from "../assets/img_for_categories/antivirus.png"
import graphics from "../assets/img_for_categories/graphics.png"
import utilits from "../assets/img_for_categories/utilits.png"
import kaspprem from "../assets/img_for_cards/kaspprem.png"


// =========================
// ХРАНИЛИЩЕ ТОВАРОВ (LOCALSTORAGE + DEFAULT DATA)
// =========================

const storedGoods = JSON.parse(localStorage.getItem("goods") || "null")

const goods = ref(
    storedGoods || [
        { id: 1, title: "Windows 11 Home", price: 1999, category: "ОС Windows", description: "Домашняя версия Windows 11 с обновленным интерфейсом, улучшенной безопасностью и оптимизацией для современных устройств.", image: win11home },
        { id: 2, title: "Windows 11 Pro", price: 3499, category: "ОС Windows", description: "Профессиональная версия Windows 11 для бизнеса с расширенными возможностями управления, шифрования и удаленного доступа.", image: win11pro },
        { id: 3, title: "Windows 11 Enterprise", price: 5999, category: "ОС Windows", description: "Корпоративная версия Windows 11 с продвинутыми функциями безопасности, управления IT-инфраструктурой и поддержки групповых политик.", image: win11ent },
        { id: 4, title: "Windows 10 Home", price: 1499, category: "ОС Windows", description: "Домашняя версия Windows 10 с привычным интерфейсом, подходящая для повседневного использования и игр.", image: win10home },
        { id: 5, title: "Windows 10 Pro", price: 2999, category: "ОС Windows", description: "Профессиональная версия Windows 10 для малого и среднего бизнеса с дополнительными инструментами управления устройствами и безопасности.", image: win10pro },
        { id: 6, title: "Windows 10 Enterprise", price: 5499, category: "ОС Windows", description: "Корпоративная версия Windows 10 с поддержкой групповых политик, управлением устройствами и расширенной безопасностью.", image: win10ent },
        { id: 7, title: "Kaspersky Premium", price: 2199, category: "Антивирусы", description: "Комплексная защита компьютера и мобильных устройств от вирусов, троянов, фишинга и угроз в сети.", image: kaspprem },
        { id: 8, title: "Dr.Web Security Space", price: 1899, category: "Антивирусы", description: "Антивирусная защита с расширенными функциями контроля трафика, антишпионским модулем и родительским контролем.", image: img },
        { id: 9, title: "Office 365 для семьи", price: 4999, category: "Офисные продукты", description: "Подписка на Office для всей семьи: Word, Excel, PowerPoint, Outlook, OneDrive для до 6 пользователей.", image: ms365sem },
        { id: 10, title: "Office 365 Персональный", price: 2999, category: "Офисные продукты", description: "Подписка Office для одного пользователя с облачным хранилищем и всеми актуальными приложениями Microsoft.", image: img },
        { id: 11, title: "Office 2019 Professional Plus", price: 3999, category: "Офисные продукты", description: "Классический пакет Microsoft Office с Word, Excel, PowerPoint, Outlook и Publisher для профессионального использования.", image: img },
        { id: 12, title: "Autodesk AutoCAD 2025", price: 7499, category: "Графика и дизайн", description: "Мощное программное обеспечение для проектирования и черчения 2D и 3D с поддержкой современных CAD-стандартов.", image: img },
        { id: 13, title: "Windows Server Standard 2025", price: 10999, category: "ОС Windows", description: "Серверная платформа с поддержкой виртуализации, сетевого управления и корпоративной безопасности.", image: winserstand },
        { id: 14, title: "Autodesk All Apps", price: 19999, category: "Графика и дизайн", description: "Подписка на полный набор программ Autodesk для 3D-моделирования, архитектуры, визуализации и дизайна.", image: img },
        { id: 15, title: "Adobe Photoshop", price: 3999, category: "Графика и дизайн", description: "Профессиональный редактор изображений для фотографов и дизайнеров.", image: img },
        { id: 16, title: "Adobe Illustrator", price: 3999, category: "Графика и дизайн", description: "Векторный редактор для создания логотипов, иллюстраций и графического дизайна.", image: img },
        { id: 17, title: "CCleaner Professional", price: 999, category: "Утилиты", description: "Утилита для очистки системы, удаления мусора, управления автозагрузкой и оптимизации Windows.", image: img },
        { id: 18, title: "Revo Uninstaller Pro", price: 1299, category: "Утилиты", description: "Расширенный деинсталлятор для полного удаления программ и остаточных файлов из системы.", image: img },
        { id: 19, title: "WinRAR лицензия", price: 799, category: "Утилиты", description: "Популярный архиватор для сжатия и распаковки файлов форматов RAR, ZIP и других архивов.", image: img },
    ]
)

// =========================
// СИНХРОНИЗАЦИЯ С LOCALSTORAGE
// =========================

watch(goods, (newGoods) => {
    localStorage.setItem("goods", JSON.stringify(newGoods))
}, { deep: true })

// =========================
// КАТЕГОРИИ ТОВАРОВ
// =========================

const categories = ref([
  {
    id: 1,
    title: "Офисные продукты",
    slug: "office",
    image: office
  },
  {
    id: 2,
    title: "ОС Windows",
    slug: "windows-os",
    image: msOS
  },
  {
    id: 3,
    title: "Игры",
    slug: "games",
    image: games
  },
  {
    id: 4,
    title: "Антивирусы",
    slug: "antivirus",
    image: antivirus
  },
  {
    id: 5,
    title: "Графика и дизайн",
    slug: "graphics-design",
    image: graphics
  },
  {
    id: 6,
    title: "Утилиты",
    slug: "utilities",
    image: utilits
  }
])
// =========================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ТОВАРАМИ
// =========================

// получение всех товаров (reactive ref)
function getGoods() { return goods }

// поиск товара по ID
function getGoodsById(id) { return goods.value.find(g => g.id == id) }

// добавление нового товара
function addGoods(product) {
    const maxId = goods.value.length ? Math.max(...goods.value.map(g => g.id)) : 0
    product.id = maxId + 1
    goods.value.push(product)
    product.image = img
}

// обновление товара по ID
function updateGoods(id, data) {
    const index = goods.value.findIndex(g => g.id == id)
    if (index !== -1) goods.value[index] = { ...goods.value[index], ...data }
}

// удаление товара
function deleteGoods(id) {
    goods.value = goods.value.filter(g => g.id != id)
}

// получение всех категорий
function getCategories() { return categories }

// фильтр товаров по категории
function getGoodsByCategory(catTitle) { return goods.value.filter(g => g.category === catTitle) }

// =========================
// ЭКСПОРТ COMPOSABLE
// =========================

export function useGoods() {
    return {
        // товары
        goods,
        getGoods,
        getGoodsById,
        addGoods,
        updateGoods,
        deleteGoods,

        // категории
        categories,
        getCategories,
        getGoodsByCategory,
    }
}