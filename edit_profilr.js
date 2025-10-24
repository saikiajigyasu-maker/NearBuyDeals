// Load existing profile data from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("userProfile")) || {
    name: "John Doe",
    email: "johndoe@example.com",
    photo: "https://via.placeholder.com/100"
  };

  document.getElementById("fullName").value = user.name;
  document.getElementById("email").value = user.email;
  document.getElementById("photoPreview").src = user.photo;
});

// Handle photo preview
document.getElementById("profilePhoto").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById("photoPreview").src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

// Save profile
document.getElementById("editProfileForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const photo = document.getElementById("photoPreview").src;

  const updatedProfile = { name, email, photo };
  if (password) updatedProfile.password = password; // optional

  localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

  alert("Profile updated successfully!");
  window.location.href = "account.html"; // redirect back
});
// Save profile
document.getElementById("editProfileForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const photo = document.getElementById("photoPreview").src;

  const updatedProfile = { name, email, photo };
  if (password) updatedProfile.password = password; // optional

  localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

  alert("Profile updated successfully!");
  window.location.href = "account.html"; // redirect back
});
