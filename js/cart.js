const cartEl = document.getElementById("cart")
const totalEl = document.getElementById("total")

let cart = JSON.parse(localStorage.getItem("cart")) || []

function renderCart() {
  cartEl.innerHTML = ""
  let total = 0

  cart.forEach((item, index) => {
    total += item.price * item.qty

    cartEl.innerHTML += `
      <div>
        <img src="${item.image}" width="50"/>
        ${item.name} (${item.flavor})
        x${item.qty} = ${item.price * item.qty} zł

        <button onclick="removeItem(${index})">❌</button>
      </div>
    `
  })

  totalEl.innerText = "Total: " + total + " zł"
}

window.removeItem = (i) => {
  cart.splice(i, 1)
  localStorage.setItem("cart", JSON.stringify(cart))
  renderCart()
}

renderCart()