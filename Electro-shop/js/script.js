// script.js

// ====== ДАННЫЕ ТОВАРОВ ======
const products = [
    {id: 1, name: 'iPhone 14', category: 'phones', price: 79990, img: 'img/iphone14.jpg', description: 'Смартфон Apple iPhone 14.'},
    {id: 2, name: 'Samsung Galaxy S23', category: 'phones', price: 69990, img: 'img/galaxyS23.jpg', description: 'Смартфон Samsung Galaxy S23.'},
    {id: 3, name: 'MacBook Air', category: 'laptops', price: 129990, img: 'img/macbookair.jpg', description: 'Ноутбук Apple MacBook Air.'},
    {id: 4, name: 'Dell XPS 13', category: 'laptops', price: 119990, img: 'img/dellxps13.jpg', description: 'Ноутбук Dell XPS 13.'},
    {id: 5, name: 'AirPods Pro', category: 'accessories', price: 19990, img: 'img/airpodspro.jpg', description: 'Беспроводные наушники Apple AirPods Pro.'},
    {id: 6, name: 'Logitech Mouse', category: 'accessories', price: 2990, img: 'img/logitechmouse.jpg', description: 'Беспроводная мышь Logitech.'}
];

// ====== КОРЗИНА (LocalStorage) ======
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Добавление товара в корзину
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    let cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    saveCart(cart);
    alert(`${product.name} добавлен в корзину!`);
}

// Удаление товара из корзины
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// Изменение количества товара в корзине
function changeQuantity(id, delta) {
    let cart = getCart();
    const item = cart.find(p => p.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) item.quantity = 1;
    }
    saveCart(cart);
    renderCart();
}

// Обновление счётчика корзины
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalCount;
}

// ====== ОТОБРАЖЕНИЕ ТОВАРОВ ======
function renderProducts(listId, filterCategory = 'all', searchTerm = '') {
    const listEl = document.getElementById(listId);
    if (!listEl) return;
    listEl.innerHTML = '';

    let filtered = products;

    if (filterCategory !== 'all') {
        filtered = filtered.filter(p => p.category === filterCategory);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p>Цена: ${p.price.toLocaleString()} ₽</p>
            <button onclick="addToCart(${p.id})">Добавить в корзину</button>
        `;
        listEl.appendChild(card);
    });
}

// ====== КОРЗИНА НА СТРАНИЦЕ cart.html ======
function renderCart() {
    const cartEl = document.getElementById('cart-items');
    if (!cartEl) return;
    cartEl.innerHTML = '';
    const cart = getCart();
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <span>${item.name}</span>
            <span>${item.price.toLocaleString()} ₽</span>
            <div>
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">Удалить</button>
            </div>
        `;
        cartEl.appendChild(div);
    });

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.textContent = `Общая сумма: ${total.toLocaleString()} ₽`;
}

// ====== РЕГИСТРАЦИЯ / ВХОД ======
function handleLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = {username, email, password};
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('login-msg').textContent = `Привет, ${username}! Вы успешно вошли.`;
        form.reset();
    });
}

// ====== ФИЛЬТРЫ И ПОИСК ======
function initFilters() {
    const filterSelect = document.getElementById('category-filter');
    const searchInput = document.getElementById('search');

    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            renderProducts('catalog-list', filterSelect.value, searchInput ? searchInput.value : '');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderProducts('catalog-list', filterSelect ? filterSelect.value : 'all', searchInput.value);
        });
    }
}

// ====== ИНИЦИАЛИЗАЦИЯ СТРАНИЦ ======
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем счётчик корзины
    updateCartCount();

    // Главная страница
    if (document.getElementById('product-list')) {
        renderProducts('product-list');
    }

    // Каталог
    if (document.getElementById('catalog-list')) {
        renderProducts('catalog-list');
        initFilters();
    }

    // Корзина
    if (document.getElementById('cart-items')) {
        renderCart();
        const checkoutBtn = document.getElementById('checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Спасибо за заказ!');
                localStorage.removeItem('cart');
                renderCart();
            });
        }
    }

    // Вход / регистрация
    if (document.getElementById('login-form')) {
        handleLogin();
    }
});
