import { supabase } from "./supabase.js"

document.addEventListener("DOMContentLoaded", () => {

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

  /* ---------------- UI UPDATE ---------------- */

  async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      authForm.classList.add("hidden")
      userPanel.classList.remove("hidden")
      userEmail.innerText = user.email

      if (authNav) authNav.innerText = "Logout"

      // 👑 админ
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (data?.role === "admin") {
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

  /* ---------------- PRODUCTS ---------------- */

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
        <div class="card">
          <img src="${product.image}" />
          <h3>${product.name}</h3>
          <p>${product.price} zł</p>
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

})