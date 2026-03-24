import { supabase } from "./supabase.js"

window.placeOrder = async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  const delivery = document.getElementById("delivery").value
  const payment = document.getElementById("payment").value

  const { error } = await supabase
    .from("orders")
    .insert([{
      items: JSON.stringify(cart),
      delivery,
      payment
    }])

  if (error) alert(error.message)
  else {
    alert("Zamówienie złożone 🎉")
    localStorage.removeItem("cart")
    window.location.href = "index.html"
  }
}