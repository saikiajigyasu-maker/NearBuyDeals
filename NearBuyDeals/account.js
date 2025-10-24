// Tab switching
const menuItems = document.querySelectorAll(".account-menu li");
const tabContents = document.querySelectorAll(".tab-content");

menuItems.forEach(item => {
  item.addEventListener("click", () => {
    // Remove active from all
    menuItems.forEach(i => i.classList.remove("active"));
    tabContents.forEach(tab => tab.classList.remove("active"));

    // Add active to clicked
    item.classList.add("active");
    document.getElementById(item.dataset.tab).classList.add("active");
  });
});

// Settings form (demo only)
document.getElementById("settingsForm").addEventListener("submit", e => {
  e.preventDefault();
  alert("Settings saved successfully!");
});

// Logout
document.getElementById("confirmLogout").addEventListener("click", () => {
  alert("You have been logged out.");
  window.location.href = "login.htm"; // redirect to login
});
document.getElementById("confirmLogout").addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "index.htm";
});

// account.js

// Tab switching
const tabLinks = document.querySelectorAll(".tab-link");
const sections = document.querySelectorAll(".tab-content");

function showTab(id) {
  sections.forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  // Sidebar active state
  document.querySelectorAll("#accountMenu .tab-link").forEach(li => {
    li.classList.remove("bg-indigo-50", "text-indigo-700");
  });
  const activeLi = document.querySelector(`#accountMenu .tab-link[data-tab="${id}"]`);
  if (activeLi) activeLi.classList.add("bg-indigo-50", "text-indigo-700");
}

tabLinks.forEach(link => {
  link.addEventListener("click", e => {
    const id = link.dataset.tab || link.getAttribute("href")?.replace("#", "");
    if (!id) return;
    e.preventDefault();
    showTab(id);
  });
});

// Default tab
showTab("overview");

// Local storage helpers
const LS_KEYS = {
  isLoggedIn: "isLoggedIn",
  myDeals: "myDeals"
};

function getDeals() {
  const raw = localStorage.getItem(LS_KEYS.myDeals);
  return raw ? JSON.parse(raw) : [];
}

function setDeals(deals) {
  localStorage.setItem(LS_KEYS.myDeals, JSON.stringify(deals));
}

// Render My Deals
const myDealsGrid = document.getElementById("myDealsGrid");
const myDealsEmpty = document.getElementById("myDealsEmpty");

function renderMyDeals() {
  const deals = getDeals();
  myDealsGrid.innerHTML = "";
  if (!deals.length) {
    myDealsEmpty.classList.remove("hidden");
    return;
  }
  myDealsEmpty.classList.add("hidden");

  deals.forEach(d => {
    const card = document.createElement("div");
    card.className = "border rounded-lg overflow-hidden bg-white";
    card.innerHTML = `
      <img src="${d.photo}" alt="${d.name}" class="h-40 w-full object-cover">
      <div class="p-4 space-y-1">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">${d.name}</h3>
          <span class="text-sm text-gray-500">${d.distanceKm} km</span>
        </div>
        <p class="text-sm text-gray-600"><span class="font-medium">Quality:</span> ${d.quality}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Properties:</span> ${d.properties}</p>
        <p class="text-sm"><span class="font-semibold text-indigo-700">₹${d.price}</span> • <span class="text-gray-600">${d.shopName}</span></p>
        <div class="mt-3 flex items-center justify-between">
          <button data-id="${d.id}" class="delete-btn px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">Delete</button>
          <a href="deals.htm" class="px-3 py-1.5 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md">View in All Deals</a>
        </div>
      </div>
    `;
    myDealsGrid.appendChild(card);
  });

  // Wire delete
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const updated = getDeals().filter(x => String(x.id) !== String(id));
      setDeals(updated);
      renderMyDeals();
      updateStats();
    });
  });
}

// Add Item form
const addItemForm = document.getElementById("addItemForm");
const resetFormBtn = document.getElementById("resetFormBtn");
const photoInput = document.getElementById("itemPhoto");
const photoPreview = document.getElementById("photoPreview");
const photoPreviewImg = document.getElementById("photoPreviewImg");

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) {
    photoPreview.classList.add("hidden");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    photoPreviewImg.src = e.target.result;
    photoPreview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

resetFormBtn.addEventListener("click", () => {
  addItemForm.reset();
  photoPreview.classList.add("hidden");
});

addItemForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const quality = document.getElementById("itemQuality").value.trim();
  const properties = document.getElementById("itemProperties").value.trim();
  const price = Number(document.getElementById("itemPrice").value);
  const shopName = document.getElementById("shopName").value.trim();
 
  const file = photoInput.files[0];

  if (!file) {
    alert("Please select a photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = e2 => {
    const deals = getDeals();
    const newDeal = {
      id: Date.now(),
      name, quality, properties,
      price, shopName, distanceKm,
      photo: e2.target.result
    };
    deals.unshift(newDeal);
    setDeals(deals);
    addItemForm.reset();
    photoPreview.classList.add("hidden");
    showTab("myDeals");
    renderMyDeals();
    updateStats();
  };
  reader.readAsDataURL(file);
});

// Stats from deals count
function updateStats() {
  const deals = getDeals();
  document.getElementById("statDeals").textContent = deals.length;
  // Saved and messages are placeholders; set to 0 or pull from storage/API later
  document.getElementById("statSaved").textContent = 0;
  document.getElementById("statMessages").textContent = 0;
}
renderMyDeals();
updateStats();

// Navbar login/account visibility
(function syncNavbar() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const loginLink = document.getElementById("loginLink");
  const accountLink = document.getElementById("accountLink");

  if (isLoggedIn === "true") {
    if (loginLink) loginLink.classList.add("hidden");
    if (accountLink) accountLink.classList.remove("hidden");
  } else {
    if (loginLink) loginLink.classList.remove("hidden");
    if (accountLink) accountLink.classList.add("hidden");
  }
})();

// Logout logic: hide Account on Home
document.getElementById("confirmLogout")?.addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  window.location.href = "index.htm";
});
// Global deals (posted by shopkeepers)
let deals = JSON.parse(localStorage.getItem("deals")) || [];

// User’s saved deals (just IDs)
let savedDeals = JSON.parse(localStorage.getItem("savedDeals")) || [];

// Save a deal
function saveDeal(dealId) {
  if (!savedDeals.includes(dealId)) {
    savedDeals.push(dealId);
    localStorage.setItem("savedDeals", JSON.stringify(savedDeals));
  }
}

// Render All Deals
function renderAllDeals() {
  const container = document.getElementById("viewdeals");
  container.innerHTML = "";
  deals.forEach(d => {
    container.innerHTML += `
      <div class="deal-card">
        <h3>${d.name}</h3>
        <p>${d.price}</p>
        <button onclick="saveDeal(${d.id})">Save</button>
      </div>
    `;
  });
}

// Render Saved Deals
function renderSavedDeals() {
  const container = document.getElementById("savedDeals");
  container.innerHTML = "";
  savedDeals.forEach(id => {
    const d = deals.find(x => x.id === id);
    if (d) {
      container.innerHTML += `
        <div class="deal-card">
          <h3>${d.name}</h3>
          <p>${d.price}</p>
        </div>
      `;
    }
  });
}
// Load profile info into Account page
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("userProfile")) || {
    name: "John Doe",
    email: "johndoe@example.com",
    photo: "https://via.placeholder.com/100"
  };

  // Sidebar
  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("profilePhoto").src = user.photo;

  // Overview
  document.getElementById("overviewName").textContent = user.name;
});
