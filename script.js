const ageVerified = localStorage.getItem("ageVerified")

if (ageVerified === "true") {
  document.getElementById("agePopup").style.display = "none"
} else {
  document.getElementById("agePopup").style.display = "flex"
}

window.enter = () => {
  localStorage.setItem("ageVerified", "true")
  document.getElementById("agePopup").style.display = "none"
}