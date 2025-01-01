// Produkte und Warenkorb-Elemente initialisieren
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-Cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close'); // Sicherstellen, dass der Button existiert
let listProducts = [];
let carts = [];
let checkout = document.querySelector('.checkout');
let cartIcon = document.querySelector('.icon-Cart');
let cartTab = document.querySelector('.cartTab');
let iconCartSpan = document.querySelector('.icon-Cart .cart-count');

// Funktion: Warenkorb speichern
const saveCartToLocalStorage = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(carts));
    } catch (error) {
        console.error('Fehler beim Speichern des Warenkorbs:', error);
    }
};

// Funktion: Warenkorb laden
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        carts = savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Fehler beim Laden des Warenkorbs:', error);
        carts = [];
    }
};

// Funktion: Berechne die Gesamtanzahl der Artikel im Warenkorb
const calculateTotalQuantity = () => {
    let totalQuantity = 0;

    carts.forEach(cartItem => {
        totalQuantity += cartItem.quantity; // Addiere die Menge jedes Artikels
    });

    return totalQuantity;
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (carts.length > 0) {
        carts.forEach((cartItem, index) => {
            let product = listProducts.find(product => product.id == cartItem.product_id);
            if (!product) return;

            totalQuantity += cartItem.quantity;
            let cartItemHTML = `
                <div class="item">
                    <div class="image">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    <div class="name">${product.name}</div>
                    <div class="totalPrice">${product.price * cartItem.quantity}€</div>
                    <div class="quantity">
                        <button class="minus" data-index="${index}">-</button>
                        <span>${cartItem.quantity}</span>
                        <button class="plus" data-index="${index}">+</button>
                    </div>
                </div>
            `;
            listCartHTML.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    } else {
        listCartHTML.innerHTML = '<p>Dein Warenkorb ist leer</p>';
    }

    // Aktualisiere die Anzahl der Artikel im Cart-Icon
    iconCartSpan.innerText = totalQuantity;

    // Event-Listener für die Buttons hinzufügen
    document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            updateCartQuantity(index, -1);
        });
    });

    document.querySelectorAll('.plus').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.dataset.index;
            updateCartQuantity(index, 1);
        });
    });
};

// Funktion: Menge im Warenkorb aktualisieren
const updateCartQuantity = (index, delta) => {
    if (carts[index]) {
        carts[index].quantity += delta;

        // Produkt entfernen, wenn die Menge 0 erreicht
        if (carts[index].quantity <= 0) {
            carts.splice(index, 1);
        }

        // Warenkorb aktualisieren
        addCartToHTML();
        saveCartToLocalStorage();
    }
};

// Funktion: Artikel zum Warenkorb hinzufügen
const addToCart = (product_id) => {
    const product = listProducts.find(product => product.id === parseInt(product_id));
    if (!product) {
        console.error('Produkt nicht gefunden:', product_id);
        return;
    }

    const cartIndex = carts.findIndex(cartItem => cartItem.product_id == product_id);
    if (cartIndex === -1) {
        carts.push({
            product_id: product.id,
            quantity: 1
        });
    } else {
        carts[cartIndex].quantity += 1;
    }

    // Warenkorb aktualisieren und speichern
    addCartToHTML();
    saveCartToLocalStorage();

    // Warenkorb anzeigen
    if (!body.classList.contains('showCart')) {
        body.classList.add('showCart');
    }
};

// Funktion: Produkte laden
const loadProducts = async () => {
    try {
        const response = await fetch('singles.json');
        const data = await response.json();
        listProducts = data.products || [];

        if (listProducts.length > 0) {
            addDataToHTML();
        } else {
            listProductHTML.innerHTML = '<p>Keine Produkte verfügbar</p>';
        }
    } catch (error) {
        console.error('Fehler beim Laden der Produkte:', error);
        listProductHTML.innerHTML = '<p>Fehler beim Laden der Produkte</p>';
    }
};

// Funktion: Produkte auf der Seite anzeigen
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    listProducts.forEach(product => {
        let productHTML = `
            <div class="item" data-id="${product.id}">
                <div class="small-container-2">
                    <div class="product-card">
                        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                        <div class="product-details">
                            <h2 class="product-name">${product.name}</h2>
                            <div class="price">${product.price}€</div>
                            <button class="addCart">Add To Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        listProductHTML.insertAdjacentHTML('beforeend', productHTML);
    });
};

// Event-Listener für "Add To Cart"
listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        const productId = event.target.closest('.item').dataset.id;
        addToCart(productId);
    }
});

// Warenkorb öffnen/schließen
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
    // Wenn der Warenkorb geöffnet wird, aktualisiere die Anzeige
    if (body.classList.contains('showCart')) {
        addCartToHTML(); // Warenkorb-Inhalt anzeigen, wenn geöffnet
    }
});

// Sicherstellen, dass der Close-Button funktioniert
closeCart.addEventListener('click', () => {
    body.classList.remove('showCart');
});

// Checkout-Button
checkout.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

const updateCartIcon = () => {
    const totalQuantity = calculateTotalQuantity(); // Gesamtanzahl der Artikel im Warenkorb berechnen
    iconCartSpan.innerText = totalQuantity; // Anzahl im Cart-Icon anzeigen
};

// App initialisieren
const initApp = () => {
    loadCartFromLocalStorage(); // Laden des Warenkorbs aus dem LocalStorage
    loadProducts(); // Laden der Produkte
    addCartToHTML(); // Direkt nach dem Laden des Warenkorbs die Anzeige der Artikel im Warenkorb aktualisieren
    updateCartIcon(); // Direkte Anzeige der Anzahl im Warenkorb-Icon
}

// App starten
initApp();
