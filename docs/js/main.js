document.addEventListener('DOMContentLoaded', function() {
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const minusBtn = control.querySelector('.quantity-btn.minus');
        const plusBtn = control.querySelector('.quantity-btn.plus');
        const quantityDisplay = control.querySelector('.quantity-display');
        
        if (minusBtn && plusBtn && quantityDisplay) {
            let quantity = parseInt(quantityDisplay.textContent) || 1;
            
            minusBtn.addEventListener('click', () => {
                if (quantity > 1) {
                    quantity--;
                    quantityDisplay.textContent = quantity;
                }
            });
            
            plusBtn.addEventListener('click', () => {
                quantity++;
                quantityDisplay.textContent = quantity;
            });
        }
    });
    
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn, .app-offer');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            console.log('Товар додано до кошика');
            
            showNotification('Товар додано до кошика!');
            
            updateCartCount();
        });
    });
    
    const searchInput = document.querySelector('.search-input');
    const priceCheckbox = document.querySelector('#under10');
    const filterSelect = document.querySelector('.filter-select');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterProducts, 300));
    }
    
    if (priceCheckbox) {
        priceCheckbox.addEventListener('change', filterProducts);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProducts);
    }
    
    const clearButtons = document.querySelectorAll('.clear-btn');
    
    clearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterGroup = this.closest('.filter-group');
            
            if (filterGroup) {
                const input = filterGroup.querySelector('input');
                const select = filterGroup.querySelector('select');
                
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                }
                
                if (select) {
                    select.selectedIndex = 0;
                }
                
                filterProducts();
            }
        });
    });
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            console.log('Завантаження додаткових товарів...');
            
            this.textContent = 'Завантаження...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Завантажити більше';
                this.disabled = false;
                showNotification('Більше товарів завантажено!');
            }, 1500);
        });
    }
    
    function filterProducts() {
        console.log('Фільтрація товарів...');
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #8b5a2b;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent.match(/\d+/)) || 0;
            cartCount.textContent = `(${currentCount + 1})`;
        }
    }
    
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
});