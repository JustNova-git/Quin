// Данные товаров
const products = [
    {
        id: 1,
        title: "Ваза геометрическая",
        category: "decor",
        price: 1200,
        icon: "🏺"
    },
    {
        id: 2,
        title: "Фигурка кота",
        category: "figures",
        price: 850,
        icon: "🐱"
    },
    {
        id: 3,
        title: "Подставка для телефона",
        category: "accessories",
        price: 450,
        icon: "📱"
    },
    {
        id: 4,
        title: "Органайзер для канцелярии",
        category: "organizers",
        price: 680,
        icon: "✏️"
    },
    {
        id: 5,
        title: "Декоративный шар",
        category: "decor",
        price: 950,
        icon: "🔮"
    },
    {
        id: 6,
        title: "Фигурка дракона",
        category: "figures",
        price: 1500,
        icon: "🐉"
    },
    {
        id: 7,
        title: "Брелок индивидуальный",
        category: "accessories",
        price: 250,
        icon: "🔑"
    },
    {
        id: 8,
        title: "Органайзер для проводов",
        category: "organizers",
        price: 380,
        icon: "🔌"
    },
    {
        id: 9,
        title: "Кашпо для цветов",
        category: "decor",
        price: 1100,
        icon: "🪴"
    },
    {
        id: 10,
        title: "Фигурка совы",
        category: "figures",
        price: 920,
        icon: "🦉"
    },
    {
        id: 11,
        title: "Подставка под кружку",
        category: "accessories",
        price: 320,
        icon: "☕"
    },
    {
        id: 12,
        title: "Органайзер для ванной",
        category: "organizers",
        price: 540,
        icon: "🛁"
    }
];

// Корзина
let cart = [];

// DOM элементы
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');
const orderForm = document.getElementById('orderForm');

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    loadCart();
    setupEventListeners();
});

// Рендеринг товаров
function renderProducts(category) {
    const filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    productsGrid.innerHTML = filtered.map(product => `
        <div class="product-card">
            <div class="product-image">${product.icon}</div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-price">${product.price} ₽</p>
                <button class="add-to-cart" data-id="${product.id}">В корзину</button>
            </div>
        </div>
    `).join('');

    // Добавляем обработчики на кнопки
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        });
    });
}

// Получение названия категории
function getCategoryName(category) {
    const names = {
        decor: 'Декор',
        figures: 'Фигурки',
        accessories: 'Аксессуары',
        organizers: 'Органайзеры'
    };
    return names[category] || category;
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification('Товар добавлен в корзину!');
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Рендеринг корзины
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
        cartTotal.textContent = '0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <p class="cart-item-title">${item.title}</p>
                <p class="cart-item-price">${item.price} ₽ x ${item.quantity}</p>
            </div>
            <button class="remove-from-cart" data-id="${item.id}">✕</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total;

    // Обработчики удаления
    document.querySelectorAll('.remove-from-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        });
    });
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
}

// Сохранение корзины в localStorage
function saveCart() {
    localStorage.setItem('murMeteorCart', JSON.stringify(cart));
}

// Загрузка корзины из localStorage
function loadCart() {
    const saved = localStorage.getItem('murMeteorCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Показ уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтрация товаров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProducts(btn.dataset.category);
        });
    });

    // Открытие корзины
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.style.display = 'block';
    });

    // Закрытие корзины
    closeCart.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Оформление заказа
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        cartModal.style.display = 'none';
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsList = cart.map(item => `${item.title} x${item.quantity}`).join(', ');
        
        const textarea = orderForm.querySelector('textarea');
        textarea.value = `Заказ с сайта:\n${itemsList}\nИтого: ${total} ₽`;
    });

    // Мобильное меню
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Отправка формы
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо за заказ! Мы свяжемся с вами в ближайшее время.');
        cart = [];
        saveCart();
        updateCartCount();
        orderForm.reset();
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                navLinks.classList.remove('active');
            }
        });
    });
}

// Добавляем анимации в CSS динамически
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
