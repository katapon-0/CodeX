import { ref, computed } from "vue"
import { useGoods } from './useGoods'
const goodsStore = useGoods()

// =========================
// ПОЛЬЗОВАТЕЛЬ И СЕССИЯ
// =========================

const currentUserStored = localStorage.getItem('CurrentUser')
const currentUser = ref(currentUserStored ? JSON.parse(currentUserStored) : null)

// ТЕКУЩАЯ РОЛЬ (из пользователя или guest)
const currentRole = computed(() => currentUser.value?.role || 'guest')

function isAdmin() {
    return currentRole.value === 'admin'
}

function isAuth() {
    return currentRole.value === 'user' || currentRole.value === 'admin'
}

// =========================
// ХРАНИЛИЩЕ ПОЛЬЗОВАТЕЛЕЙ
// =========================

const userList = ref(JSON.parse(localStorage.getItem('users')) || [
    {
        login: "admin",
        name: "Админ",
        password: "admin123",
        email: "admin@mail.ru",
        phone: "",
        birthdate: "",
        role: "admin",
        cart: [],
        favorites: [],
        orders: []
    }
])

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(userList.value))
}

function saveCurrentUser() {
    if (currentUser.value) {
        localStorage.setItem('CurrentUser', JSON.stringify(currentUser.value))
    } else {
        localStorage.removeItem('CurrentUser')
    }
}

// =========================
// АВТОРИЗАЦИЯ
// =========================

function loginUser(loginStr, passwordStr) {
    const user = userList.value.find(
        u => u.login === loginStr && u.password === passwordStr
    )

    if (!user) return false

    currentUser.value = { ...user }
    saveCurrentUser()
    return true
}

function logoutUser() {
    currentUser.value = null
    saveCurrentUser()
}

// =========================
// УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ (CRUD)
// =========================

function addUser(newUser) {
    const login = newUser.login.trim().toLowerCase()

    const exists = userList.value.find(
        u => u.login.toLowerCase() === login
    )

    if (exists) return false

    const userWithRole = {
        login,
        password: newUser.password,
        name: newUser.name || "",
        email: newUser.email.toLowerCase(),
        phone: newUser.phone || "",
        birthdate: newUser.birthdate || "",
        role: 'user',
        cart: [],
        favorites: [],
        orders: []
    }

    userList.value.push(userWithRole)
    saveUsers()

    currentUser.value = { ...userWithRole }
    saveCurrentUser()

    return true
}

function editUser(loginStr, newData) {
    const idx = userList.value.findIndex(u => u.login === loginStr)
    if (idx === -1) return

    userList.value[idx] = {
        ...userList.value[idx],
        ...newData
    }

    saveUsers()

    if (currentUser.value?.login === loginStr) {
        currentUser.value = { ...userList.value[idx] }
        saveCurrentUser()
    }
}

function deleteUser(loginStr) {
    const idx = userList.value.findIndex(u => u.login === loginStr)
    if (idx === -1) return

    userList.value.splice(idx, 1)
    saveUsers()

    if (currentUser.value?.login === loginStr) {
        logoutUser()
    }
}

// =========================
// КОРЗИНА
// =========================

function addToCart(productId, quantity = 1) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    const item = user.cart.find(i => i.id === productId)

    if (item) {
        item.quantity += quantity
    } else {
        user.cart.push({ id: productId, quantity })
    }

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

function removeFromCart(productId) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    user.cart = user.cart.filter(i => i.id !== productId)

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

function updateCartQuantity(productId, quantity) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    const item = user.cart.find(i => i.id === productId)
    if (item) item.quantity = quantity

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

function clearCart() {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    user.cart = []

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}


function createOrder() {
    if (!currentUser.value) return false

    const userIndex = userList.value.findIndex(
        u => u.login === currentUser.value.login
    )
    if (userIndex === -1) return false

    const user = userList.value[userIndex]

    if (!Array.isArray(user.orders)) {
        user.orders = []
    }

    if (!user.cart.length) return false

    const items = user.cart.map(cartItem => {
        const product = goodsStore.goods.value.find(g => g.id === cartItem.id)

        return {
            id: cartItem.id,
            title: product?.title || 'Товар',
            price: product?.price || 0,
            quantity: cartItem.quantity
        }
    })

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const orderIdCounterKey = 'orderIdCounter'

    function getNextOrderId() {
        const current = Number(localStorage.getItem(orderIdCounterKey) || 0)
        const next = current + 1
        localStorage.setItem(orderIdCounterKey, next)
        return next
    }

    const newOrder = {
        id: getNextOrderId(),
        date: new Date().toISOString().slice(0, 10),
        status: 'В обработке',
        items,
        total
    }

    const updatedUser = {
        ...user,
        orders: [...user.orders, newOrder],
        cart: []
    }


    userList.value[userIndex] = updatedUser
    currentUser.value = { ...updatedUser }

    saveUsers()
    saveCurrentUser()

    return true
}

// =========================
// КОРЗИНА (ВЫЧИСЛЕНИЯ)
// =========================

const cartCount = computed(() => {
    if (!currentUser.value?.cart) return 0
    return currentUser.value.cart.reduce((sum, item) => sum + item.quantity, 0)
})



// =========================
// ИЗБРАННОЕ
// =========================

function addToFavorites(productId) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    if (!user.favorites.includes(productId)) {
        user.favorites.push(productId)
    }

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

function removeFromFavorites(productId) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    user.favorites = user.favorites.filter(id => id !== productId)

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

function toggleFavorite(productId) {
    if (!currentUser.value) return

    const user = userList.value.find(u => u.login === currentUser.value.login)
    if (!user) return

    if (user.favorites.includes(productId)) {
        user.favorites = user.favorites.filter(id => id !== productId)
    } else {
        user.favorites.push(productId)
    }

    currentUser.value = { ...user }
    saveCurrentUser()
    saveUsers()
}

// =========================
// ИЗБРАННОЕ (ВЫЧИСЛЕНИЯ)
// =========================

const favoritesCount = computed(() => {
    if (!currentUser.value?.favorites) return 0
    return currentUser.value.favorites.length
})

// =========================
// ЭКСПОРТ COMPOSABLE
// =========================

export function useUsers() {
    return {
        userList,
        currentUser,
        currentRole,

        loginUser,
        logoutUser,
        addUser,
        editUser,
        deleteUser,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,

        createOrder,

        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        favoritesCount,

        isAdmin,
        isAuth
    }
}