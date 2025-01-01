const loadCartFromLocalStorage_1 = () => {
    try {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
    }
};

// Funktion: Produkte aus JSON-Datei laden
const loadProductsFromJSON = async () => {
    try {
        const response = await fetch('singles.json');
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Error loading products from JSON:', error);
        return [];
    }
};

// Funktion: Warenkorbdaten anzeigen
const renderCart = async () => {
    const carts = loadCartFromLocalStorage_1(); // Warenkorbdaten aus localStorage laden
    const products = await loadProductsFromJSON(); // Produkte aus JSON laden
    const cartTableBody = document.querySelector('.cart-table-body');
    const subtotalElement = document.querySelector('.subtotal');
    const taxesElement = document.querySelector('.taxes');
    const totalElement = document.querySelector('.total');

    // Leere die bestehende Tabelle
    cartTableBody.innerHTML = '';

    let subtotal = 0;

    // Überprüfen, ob der Warenkorb leer ist
    if (carts.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="3">Your cart is empty</td></tr>';
        subtotalElement.textContent = '0€';
        taxesElement.textContent = '0€';
        totalElement.textContent = '0€';
        return;
    }

    // Über die Artikel iterieren und anzeigen
    carts.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.product_id); // Passendes Produkt finden
        if (!product) return;

        const subtotalItem = product.price * cartItem.quantity;
        subtotal += subtotalItem;

        // Erstelle eine neue Tabellenzeile
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="cart-info">
                    <img src="${product.images[0]}" alt="${product.name}">
                    <div>
                        <p>${product.name}</p>
                        <small>Price: ${product.price}€</small>
                        <br>
                        <a href="#" class="remove-item" data-product-id="${cartItem.product_id}">Remove</a>
                    </div>
                </div>
            </td>
            <td><input type="number" value="${cartItem.quantity}" class="quantity-input" data-product-id="${cartItem.product_id}"></td>
            <td>${subtotalItem.toFixed(2)}€</td>
        `;
        cartTableBody.appendChild(row);
    });

    

    // Berechnungen
    const taxes = subtotal * 0.19;
    const total = subtotal + taxes;

    subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
    taxesElement.textContent = `${taxes.toFixed(2)}€`;
    totalElement.textContent = `${total.toFixed(2)}€`;

    // Initialisiere Event-Listener für die neuen Elemente
    initQuantityChangeListeners();
    initRemoveItemListeners();
};

const removeItemFromCart = (productId) => {
    const carts = loadCartFromLocalStorage_1(); // Warenkorbdaten laden
    // Filtere alle Artikel, deren Produkt-ID nicht mit der zu entfernenden ID übereinstimmt
    const updatedCart = carts.filter(item => item.product_id !== parseInt(productId, 10));
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Aktualisiere den Warenkorb in localStorage

    renderCart(); // Render den Warenkorb neu
    loadCartFromLocalStorage(); // Laden des Warenkorbs aus dem LocalStorage
    updateCartIcon(); // Direkte Anzeige der Anzahl im Warenkorb-Icon
};

// Event-Listener für den "Remove"-Link
const initRemoveItemListeners = () => {
    const removeLinks = document.querySelectorAll('.remove-item');
    removeLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Standard-Link-Verhalten verhindern
            const productId = event.target.dataset.productId; // Produkt-ID aus dem data-Attribut holen
            removeItemFromCart(productId); // Alle Instanzen dieses Produkts entfernen
        });
    });
   
};

// Event-Listener für die Mengenänderung
const initQuantityChangeListeners = () => {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const productId = event.target.dataset.productId;
            const newQuantity = parseInt(event.target.value, 10);

            if (newQuantity <= 0) {
                removeItemFromCart(productId);
            } else {
                updateCartQuantity_1(productId, newQuantity);
            }

            renderCart(); // Nachdem die Menge geändert wurde, den Warenkorb neu rendern
        });
    });
};

// Funktion: Menge eines Artikels im Warenkorb aktualisieren
const updateCartQuantity_1 = (productId, newQuantity) => {
    const carts = loadCartFromLocalStorage_1();
    const cartItemIndex = carts.findIndex(item => item.product_id === productId);

    if (cartItemIndex !== -1) {
        carts[cartItemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(carts)); // Update in localStorage
    }
};





// Hauptfunktion: Seite initialisieren
const initCartPage = async () => {
    await renderCart(); // Warenkorb anzeigen, wartet auf das Laden der Produkte
    initQuantityChangeListeners(); // Event-Listener für Mengenänderung
    initRemoveItemListeners(); // Event-Listener für das Entfernen von Artikeln
};

document.addEventListener("DOMContentLoaded", function () {
    const totalElement = document.querySelector(".total"); // Element mit dem Total-Wert
    const checkoutButton = document.getElementById("checkoutButton");

    function toggleCheckoutButton() {
        // Extrahiere den numerischen Wert des Total-Elements (ohne Währungszeichen)
        const totalValue = parseFloat(totalElement.textContent.replace("€", "").trim());

        if (totalValue === 0) {
            checkoutButton.disabled = true; // Deaktiviere den Button
            checkoutButton.style.opacity = "0.5"; // Optional: Optisch deaktivieren
            checkoutButton.style.cursor = "not-allowed";
        } else {
            checkoutButton.disabled = false; // Aktiviere den Button
            checkoutButton.style.opacity = "1"; // Button wieder aktiv
            checkoutButton.style.cursor = "pointer";
        }
    }

    // Überprüfe den Status direkt bei Seitenladezeit
    toggleCheckoutButton();

    // Optional: Überwache Änderungen am Total-Wert
    const observer = new MutationObserver(toggleCheckoutButton);
    observer.observe(totalElement, { childList: true, characterData: true, subtree: true });
});

// Wenn die Seite geladen ist, rufe die Funktion `initCartPage` auf
document.addEventListener('DOMContentLoaded', initCartPage);



