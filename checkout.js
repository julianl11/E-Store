// Funktion: Warenkorb aus dem localStorage laden
const loadCartFromLocalStorage_2 = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

// Funktion: Produkte aus JSON laden


// Funktion: Warenkorb und Rechnungsdetails auf der Seite anzeigen
const updateCheckoutPage = async () => {
    const cartItems = loadCartFromLocalStorage_2();
    const products = await loadProductsFromJSON();

    // Sicherstellen, dass die Elemente existieren
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalContainer) {
        console.error('Elemente für Warenkorb oder Gesamtpreis nicht gefunden!');
        return;
    }

    // Wenn der Warenkorb leer ist
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Dein Warenkorb ist leer.</p>';
        cartTotalContainer.innerHTML = '';
        return;
    }

    let totalPrice = 0;
    cartItemsContainer.innerHTML = ''; // Vorherigen Inhalt entfernen

    // Warenkorb Items anzeigen
    cartItems.forEach(item => {
        const product = products.find(p => p.id === item.product_id);
        if (!product) return;

        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
                <div class="item-info">
                    <p class="item-name">${product.name}</p>
                    <p class="item-quantity">Menge: ${item.quantity}</p>
                    <p class="item-price">${product.price}€</p>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemElement);

        totalPrice += product.price * item.quantity; // Gesamtpreis berechnen
    });

    // Gesamtpreis anzeigen
    cartTotalContainer.innerHTML = `<p><strong>Gesamtpreis: </strong>${totalPrice}€</p>`;

    // Rechnungsdetails mit den Benutzerdaten füllen
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const addressField = document.getElementById('address');
    const cityField = document.getElementById('city');
    const zipField = document.getElementById('zip');
    const countryField = document.getElementById('country');

    const storedUserData = JSON.parse(localStorage.getItem('userData')) || {};

    // Füllen der Formularfelder mit gespeicherten Benutzerdaten
    nameField.value = storedUserData.name || '';
    emailField.value = storedUserData.email || '';
    addressField.value = storedUserData.address || '';
    cityField.value = storedUserData.city || '';
    zipField.value = storedUserData.zip || '';
    countryField.value = storedUserData.country || 'de';
};

// Formularabsendung: Daten speichern und Bestellbestätigung anzeigen
document.getElementById('billing-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Benutzerdaten aus dem Formular sammeln
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value
    };

    // Benutzerdaten im localStorage speichern
    localStorage.setItem('userData', JSON.stringify(userData));

    // Eine Bestätigung anzeigen
    alert('Bestellung abgeschlossen! Vielen Dank für deinen Einkauf.');
});

// Seite initialisieren
document.addEventListener('DOMContentLoaded', () => {
    updateCheckoutPage();
});
