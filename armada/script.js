document.addEventListener('DOMContentLoaded', () => {
  const foodItems = [
    { id: "1", name: "Milk", category: "dairy", expiryDate: "2025-05-20", quantity: 1, unit: "gallon" },
    { id: "2", name: "Apples", category: "produce", expiryDate: "2025-05-18", quantity: 6, unit: "pieces" },
    { id: "3", name: "Chicken Breast", category: "meat", expiryDate: "2025-05-24", quantity: 2, unit: "lbs" }, // not expired
    { id: "4", name: "Spinach", category: "produce", expiryDate: "2025-08-15", quantity: 1, unit: "bunch" },
    { id: "5", name: "Yogurt", category: "dairy", expiryDate: "2025-05-25", quantity: 4, unit: "cups" },
    { id: "6", name: "Bread", category: "grains", expiryDate: "2025-05-27", quantity: 1, unit: "loaf" }
  ];

  const foodGrid = document.querySelector('.food-grid');
  const filterButton = document.querySelector('.filter-button');

  const getExpiryStatus = (date) => {
    const now = new Date();
    const expiry = new Date(date);
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "soon";
    return "fresh";
  };

  const formatExpiryText = (date) => {
    const status = getExpiryStatus(date);
    return status === "expired" ? "EXPIRED" : new Date(date).toLocaleDateString();
  };

  const renderFoodItems = (items) => {
    foodGrid.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('food-item-card');
      card.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <h3>${item.name}</h3>
        </div>
        <div class="quantity">Quantity: ${item.quantity} ${item.unit}</div>
        <div class="expiry ${getExpiryStatus(item.expiryDate)}">Expires: ${formatExpiryText(item.expiryDate)}</div>
      `;
      foodGrid.appendChild(card);
    });
  };

  // Initial render
  renderFoodItems(foodItems);

  // Filter/sort by expiration date
  filterButton.addEventListener('click', () => {
    const sortedItems = [...foodItems].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    renderFoodItems(sortedItems);
  });
});

