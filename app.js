let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-Cart');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let listProducts = [];
let carts = [];
let checkout = document.querySelector('.checkout');
let cartIcon = document.querySelector('.icon-Cart'); // Cart-Icon
let cartTab = document.querySelector('.cartTab'); // Warenkorb-Overlay
let hideCartTimeout; // Timeout-ID
let iconCartSpan = document.querySelector('.icon-Cart .cart-count');



iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
iconCart.addEventListener('mouseenter', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
checkout.addEventListener('click', () => {
    window.location.href = 'cart.html';
})



cartIcon.addEventListener('mouseenter', () => {
    clearTimeout(hideCartTimeout); // Bestehenden Timeout abbrechen
    cartTab.style.transform = 'translateX(0)'; // Warenkorb anzeigen
});

// Maus bewegt sich in den Warenkorb
cartTab.addEventListener('mouseenter', () => {
    clearTimeout(hideCartTimeout); // Bestehenden Timeout abbrechen
});

// Maus verlässt das Cart-Icon oder den Warenkorb
[cartIcon, cartTab].forEach(element => {
    element.addEventListener('mouseleave', () => {
        hideCartTimeout = setTimeout(() => {
            cartTab.style.transform = 'translateX(100%)'; // Warenkorb ausblenden
        }, 500); // 3 Sekunden Wartezeit
    });
})

// Funktion: Warenkorb speichern
const saveCartToLocalStorage = () => {
    try {
        localStorage.setItem('cart', JSON.stringify(carts));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

// Funktion: Warenkorb laden
const loadCartFromLocalStorage = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            carts = JSON.parse(savedCart);
        } else {
            carts = [];
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        carts = [];
    }
};

// Funktion: App-Initialisierung
const initApp = () => {
    // Warenkorb aus dem Speicher laden
    loadCartFromLocalStorage();

    // Produkte laden
    fetch('inventory.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load inventory.json');
            return response.json();
        })
        .then(data => {
            listProducts = data;
            addDataToHTML(); // Produkte zur Seite hinzufügen

            // Warenkorb-Inhalt anzeigen
            addCartToHTML();

            // Warenkorbfeld öffnen, falls Artikel im Warenkorb vorhanden sind
            if (carts.length > 0) {
                body.classList.add('showCart'); // CSS-Klasse für das Öffnen des Warenkorbs
                cartTab.style.transform = 'translateX(0)'; // Overlay anzeigen
            }
        })
        .catch(error => console.error('Error loading products:', error));
};

// Warenkorb hinzufügen aktualisiert den Speicher


// Warenkorb-Inhalt anzeigen und Zähler aktualisieren
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;

    if (carts.length > 0) {
        carts.forEach(cartItem => {
            totalQuantity += cartItem.quantity;

            // Produktinformationen aus `listProducts` abrufen
            let product = listProducts.find(p => p.id == cartItem.product_id);
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                    <div class="item">
                        <div class="image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="name">${product.name}</div>
                        <div class="totalPrice">${product.price * cartItem.quantity}€</div>
                        <div class="quantity">
                            <span class="minus"><</span>
                            <span>${cartItem.quantity}</span>
                            <span class="plus">></span>
                        </div>
                    </div>
                `;
                listCartHTML.appendChild(newCart);
            }
        });
    } else {
        listCartHTML.innerHTML = '<p>Your cart is empty</p>';
    }

    // Gesamtanzahl der Artikel aktualisieren
    iconCartSpan.innerText = totalQuantity;
};

// Initialisierung starten
initApp();





// Funktion, um JSON zu laden
const fetchProducts = async () => {
    try {
        const response = await fetch('inventory.json'); // JSON-Datei laden
        if (!response.ok) throw new Error('Failed to load inventory.json');
        listProducts = await response.json(); // JSON-Daten in Array umwandeln
        addDataToHTML(); // Produkte zur HTML-Seite hinzufügen
    } catch (error) {
        console.error('Error:', error);
    }
    
};

// Funktion, um Produkte zur HTML-Seite hinzuzufügen
const addDataToHTML = () => {
    listProductHTML.innerHTML = ''; // Vorhandene Inhalte leeren
    if (listProducts.length > 0) { // Prüfen, ob Produkte vorhanden sind
        listProducts.forEach(product => {
            // Neues Produkt-Element erstellen
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <div class="small-container-2">
            <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-details">
                <h2 class="product-name">${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>
                </div>
            </div>
             
            `;
            listProductHTML.appendChild(newProduct); // Produkt zur HTML-Seite hinzufügen
        });
    } else {
        listProductHTML.innerHTML = '<p>No products available</p>'; // Nachricht anzeigen, falls keine Produkte
    }
    iconCartSpan.innerText = totalQuantity;
};



listProductHTML.addEventListener('click', (event) =>{ 
    let positionClick = event.target;
    if(positionClick.classList.contains("addCart")){
        let product_id = positionClick.closest('.item').dataset.id;
        addToCart(product_id);
    }
})







const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex(cartItem => cartItem.product_id == product_id);
    if (positionThisProductInCart === -1) {
        carts.push({ product_id: product_id, quantity: 1 });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }

    // Warenkorbfeld anzeigen
    if (!body.classList.contains('showCart')) {
        body.classList.add('showCart'); // CSS-Klasse für das Öffnen des Warenkorbs hinzufügen
    }

    cartTab.style.transform = 'translateX(0)'; // Warenkorb-Overlay anzeigen
    clearTimeout(hideCartTimeout); // Verhindern, dass das Overlay zu früh schließt

    // Warenkorb aktualisieren
    addCartToHTML();
    saveCartToLocalStorage(); // Warenkorb speichern
};




initApp();

fetchProducts();






















