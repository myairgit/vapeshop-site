import { supabase } from "./supabase.js"

const container = document.getElementById("products")

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