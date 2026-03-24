import { supabase } from "./supabase.js"

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- MODAL ---------------- */

  window.openAuth = () => {
    document.getElementById("authModal").classList.remove("hidden")
  }

  window.closeAuth = () => {
    document.getElementById("authModal").classList.add("hidden")
  }

  /* ---------------- AGE ---------------- */

  window.enter = () => {
    document.getElementById("agePopup").style.display = "none"
  }

  /* ---------------- ELEMENTS ---------------- */

  const authForm = document.getElementById("authForm")
  const userPanel = document.getElementById("userPanel")
  const userEmail = document.getElementById("userEmail")

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  const signupBtn = document.getElementById("signup")
  const signinBtn = document.getElementById("signin")
  const signoutBtn = document.getElementById("signout")

  /* ---------------- AUTH UI ---------------- */

  async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      authForm.classList.add("hidden")
      userPanel.classList.remove("hidden")
      userEmail.innerText = user.email
    } else {
      authForm.classList.remove("hidden")
      userPanel.classList.add("hidden")
    }
  }

  updateUI()

  /* ---------------- SIGN UP ---------------- */

  signupBtn.onclick = async () => {
    const { error } = await supabase.auth.signUp({
      email: emailInput.value,
      password: passwordInput.value
    })

    if (error) alert(error.message)
    else alert("Sprawdź email!")
  }

  /* ---------------- SIGN IN ---------------- */

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

  /* ---------------- SIGN OUT ---------------- */

  signoutBtn.onclick = async () => {
    await supabase.auth.signOut()
    updateUI()
  }

  /* ---------------- PRODUCTS ---------------- */

  const container = document.getElementById("products")

  if (!container) {
    console.error("❌ #products not found in HTML")
    return
  }

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

})