import { supabase } from "./supabase.js"

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- STATE ---------------- */

  let isAdmin = false

  /* ---------------- ELEMENTS ---------------- */

  const authForm = document.getElementById("authForm")
  const userPanel = document.getElementById("userPanel")
  const userEmail = document.getElementById("userEmail")

  const adminPanel = document.getElementById("adminPanel")
  const authNav = document.getElementById("authNav")

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  const signupBtn = document.getElementById("signup")
  const signinBtn = document.getElementById("signin")

  const container = document.getElementById("products")

  /* ---------------- MODAL ---------------- */

  window.openAuth = () => {
    document.getElementById("authModal").classList.remove("hidden")
  }

  window.closeAuth = () => {
    document.getElementById("authModal").classList.add("hidden")
  }

  /* ---------------- HANDLE AUTH BUTTON ---------------- */

  window.handleAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.auth.signOut()
      updateUI()
    } else {
      openAuth()
    }
  }

  /* ---------------- AGE ---------------- */

  window.enter = () => {
    document.getElementById("agePopup").style.display = "none"
  }

  /* ---------------- CHECK ADMIN ---------------- */

  async function checkAdmin(user) {
    if (!user) return false

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    return data?.role === "admin"
  }

  /* ---------------- UI ---------------- */

  async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      authForm.classList.add("hidden")
      userPanel.classList.remove("hidden")
      userEmail.innerText = user.email

      isAdmin = await checkAdmin(user)

      if (authNav) authNav.innerText = "Logout"

      if (isAdmin) {
        userEmail.innerText += " 👑 ADMIN"
        adminPanel?.classList.remove("hidden")
      }

    } else {
      authForm.classList.remove("hidden")
      userPanel.classList.add("hidden")

      if (authNav) authNav.innerText = "Login"
      adminPanel?.classList.add("hidden")
    }
  }

  updateUI()

  /* ---------------- AUTH ---------------- */

  signupBtn.onclick = async () => {
    const { error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    })

    if (error) alert(error.message)
    else alert("Sprawdź email!")
  }

  signinBtn.onclick = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    })

    if (error) alert(error.message)
    else {
      alert("Zalogowano!")
      updateUI()
    }
  }

  /* ---------------- LOAD PRODUCTS ---------------- */

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")

    if (error) {
      console.error(error)
      return
    }

    container.innerHTML = ""

    data.forEach(product => {

      container.innerHTML += `
         <div class="card" onclick="openProduct('${product.id}')">
    <img src="${product.image}" />
    <h3>${product.name}</h3>
    <p>${product.price} zł</p>

          ${isAdmin ? `
            <div class="admin-actions">
              <button onclick="deleteProduct('${product.id}')">🗑</button>
              <button onclick="editProduct('${product.id}')">✏️</button>
            </div>
          ` : ""}
        </div>
      `
    })
  }

  loadProducts()

  /* ---------------- ADD PRODUCT ---------------- */

  document.getElementById("addProduct")?.addEventListener("click", async () => {

    const name = document.getElementById("productName").value
    const price = document.getElementById("productPrice").value
    const image = document.getElementById("productImage").value

    const { error } = await supabase
      .from("products")
      .insert([{ name, price, image }])

    if (error) {
      alert(error.message)
    } else {
      alert("Produkt dodany")
      loadProducts()
    }
  })

  /* ---------------- DELETE PRODUCT ---------------- */

  window.deleteProduct = async (id) => {

    if (!confirm("Usunąć produkt?")) return

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) alert(error.message)
    else loadProducts()
  }

  /* ---------------- EDIT PRODUCT ---------------- */

  window.editProduct = async (id) => {

    const newName = prompt("Nowa nazwa:")
    const newPrice = prompt("Nowa cena:")
    const newImage = prompt("Nowy URL obrazka:")

    if (!newName || !newPrice) return

    const { error } = await supabase
      .from("products")
      .update({
        name: newName,
        price: newPrice,
        image: newImage
      })
      .eq("id", id)

    if (error) alert(error.message)
    else loadProducts()
  }

})

window.openProduct = (id) => {
  window.location.href = `product.html?id=${id}`
}

window.checkout = () => {
  window.location.href = "checkout.html"
}

const canvas = document.getElementById("smokeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Smoke {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100; // старт снизу (ВАЖНО)
    this.size = Math.random() * 20 + 10;

    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -(Math.random() * 0.6 + 0.2); // вверх всегда

    this.alpha = Math.random() * 0.08 + 0.02;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.01;
  }

  update() {
    this.angle += this.spin;

    // “плавание” как дым
    this.x += Math.sin(this.angle) * 0.6 + this.speedX;
    this.y += this.speedY;

    // лёгкий ветер
    this.x += Math.sin(this.y * 0.01) * 0.3;

    // курсор раздвигает дым
    if (mouse.x && mouse.y) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 160) {
        this.x += dx / dist * 1.2;
        this.y += dy / dist * 1.2;
      }
    }

    // респавн сверху
    if (this.y < -50) {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 50;
    }
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size
    );

    gradient.addColorStop(0, `rgba(255,255,255,${this.alpha})`);
    gradient.addColorStop(0.5, `rgba(200,200,200,${this.alpha * 0.5})`);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}