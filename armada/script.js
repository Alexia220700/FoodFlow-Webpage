document.addEventListener('DOMContentLoaded', () => {
    // Food items array
    let foodItems = [
        {
            id: "1",
            name: "Milk",
            category: "dairy",
            expiryDate: "2025-05-20",
            quantity: 1,
            unit: "gallon"
        },
        {
            id: "2",
            name: "Apples",
            category: "produce",
            expiryDate: "2025-05-18",
            quantity: 6,
            unit: "pieces"
        },
        {
            id: "3",
            name: "Chicken Breast",
            category: "meat",
            expiryDate: "2025-05-14",
            quantity: 2,
            unit: "lbs"
        },
        {
            id: "4",
            name: "Spinach",
            category: "produce",
            expiryDate: "2025-05-15",
            quantity: 1,
            unit: "bunch"
        },
        {
            id: "5",
            name: "Yogurt",
            category: "dairy",
            expiryDate: "2025-05-25",
            quantity: 4,
            unit: "cups"
        },
        {
            id: "6",
            name: "Bread",
            category: "grains",
            expiryDate: "2025-05-17",
            quantity: 1,
            unit: "loaf"
        }
    ];

    // DOM Elements
    const foodGrid = document.querySelector('.food-grid');
    const addForm = document.getElementById('addItemForm');
    const sidebarAddBtn = document.getElementById('sidebarAddBtn');
    const sortButton = document.querySelector('.filter-button');
    const searchInput = document.querySelector('.search-bar input');

    // Initialize
    let isSorted = false;
    renderFoodItems();

    // Toggle form visibility
    sidebarAddBtn.addEventListener('click', () => {
        addForm.classList.toggle('hidden');
    });

    // Form submission
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newItem = {
            id: Date.now().toString(),
            name: document.getElementById('name').value,
            category: document.getElementById('category').value.toLowerCase(),
            expiryDate: document.getElementById('expiryDate').value,
            quantity: parseInt(document.getElementById('quantity').value),
            unit: document.getElementById('unit').value
        };

        foodItems.push(newItem);
        addForm.reset();
        addForm.classList.add('hidden');
        renderFoodItems();
    });

    // Sort by expiry functionality
    sortButton.addEventListener('click', () => {
        if (!isSorted) {
            // Sort by status (expired > soon > fresh) then by date
            foodItems.sort((a, b) => {
                const statusA = getExpiryStatus(a.expiryDate);
                const statusB = getExpiryStatus(b.expiryDate);
                
                // Status priority: expired > soon > fresh
                const statusOrder = { expired: 0, soon: 1, fresh: 2 };
                if (statusOrder[statusA] !== statusOrder[statusB]) {
                    return statusOrder[statusA] - statusOrder[statusB];
                }
                
                // If same status, sort by date
                return new Date(a.expiryDate) - new Date(b.expiryDate);
            });
            sortButton.classList.add('active');
        } else {
            // Return to original order
            foodItems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            sortButton.classList.remove('active');
        }
        
        isSorted = !isSorted;
        renderFoodItems();
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        renderFoodItems();
    });

    // Helper functions
    function getExpiryStatus(date) {
        const now = new Date();
        const expiry = new Date(date);
        const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return "expired";
        if (diffDays <= 3) return "soon";
        return "fresh";
    }

    function getCategoryColorClass(category) {
        const colors = {
            dairy: "dairy",
            produce: "produce",
            meat: "meat",
            grains: "grains",
            beverages: "beverages",
            condiments: "condiments"
        };
        return colors[category] || "";
    }

    function formatExpiryText(date) {
        const status = getExpiryStatus(date);
        if (status === "expired") return "Expired";
        const options = { month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    function renderFoodItems() {
        const searchTerm = searchInput.value.toLowerCase();
        
        foodGrid.innerHTML = '';
        
        const filteredItems = foodItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.category.toLowerCase().includes(searchTerm)
        );

        filteredItems.forEach(item => {
            const foodCard = document.createElement('div');
            foodCard.classList.add('food-item-card');

            const headerDiv = document.createElement('div');
            headerDiv.style.display = 'flex';
            headerDiv.style.justifyContent = 'space-between';
            headerDiv.style.alignItems = 'center';
            headerDiv.style.marginBottom = '10px';

            const nameHeading = document.createElement('h3');
            nameHeading.textContent = item.name;

            const categoryBadge = document.createElement('span');
            categoryBadge.classList.add('category-badge', getCategoryColorClass(item.category));
            categoryBadge.textContent = item.category.charAt(0).toUpperCase() + item.category.slice(1);

            headerDiv.appendChild(nameHeading);
            headerDiv.appendChild(categoryBadge);
            foodCard.appendChild(headerDiv);

            const quantityDiv = document.createElement('div');
            quantityDiv.classList.add('quantity');
            quantityDiv.textContent = `Quantity: ${item.quantity} ${item.unit}`;
            foodCard.appendChild(quantityDiv);

            const expiryDiv = document.createElement('div');
            expiryDiv.classList.add('expiry', getExpiryStatus(item.expiryDate));
            expiryDiv.textContent = `Expires: ${formatExpiryText(item.expiryDate)}`;
            foodCard.appendChild(expiryDiv);

            foodGrid.appendChild(foodCard);
        });
    }
});

