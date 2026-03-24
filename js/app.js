import { supabase } from "./supabase.js"

/* ---------------- WAIT FOR DOM ---------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- AUTH MODAL ---------------- */

  window.openAuth = () => {
    document.getElementById("authModal").classList.remove("hidden")
  }

  window.closeAuth = () => {
    document.getElementById("authModal").classList.add("hidden")
  }

  /* ---------------- AGE POPUP ---------------- */

  window.enter = () => {
    document.getElementById("agePopup").style.display = "none"
  }

  /* ---------------- AUTH ---------------- */

  const emailInput = document.getElementById("email")
  const passwordInput = document.getElementById("password")

  const signupBtn = document.getElementById("signup")
  const signinBtn = document.getElementById("signin")
  const signoutBtn = document.getElementById("signout")

  if (signupBtn) {
    signupBtn.onclick = async () => {
      const { error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value
      })

      if (error) alert(error.message)
      else alert("Sprawdź email!")
    }
  }

  if (signinBtn) {
    signinBtn.onclick = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value
      })

      if (error) alert(error.message)
      else {
        alert("Zalogowano!")
        checkUser()
      }
    }
  }

  if (signoutBtn) {
    signoutBtn.onclick = async () => {
      await supabase.auth.signOut()
      alert("Wylogowano")
    }
  }

  /* ---------------- CHECK USER ---------------- */

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      console.log("Zalogowany:", user.email)
    } else {
      console.log("Brak logowania")
    }
  }

  checkUser()

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