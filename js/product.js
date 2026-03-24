import { supabase } from "./supabase.js"

const params = new URLSearchParams(window.location.search)
const id = params.get("id")

const nameEl = document.getElementById("name")
const imageEl = document.getElementById("image")
const flavorEl = document.getElementById("flavor")

let product = null

async function loadProduct() {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  product = data

  nameEl.innerText = data.name
  imageEl.src = data.image

  // вкусы
  if (data.flavors) {
    data.flavors.split(",").forEach(f => {
      flavorEl.innerHTML += `<option>${f.trim()}</option>`
    })
  }
}

loadProduct()

window.addToCart = () => {
  const qty = document.getElementById("qty").value
  const flavor = flavorEl.value

  let cart = JSON.parse(localStorage.getItem("cart")) || []

  cart.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    flavor,
    qty: Number(qty)
  })

  localStorage.setItem("cart", JSON.stringify(cart))

  alert("Dodano do koszyka 🛒")
}