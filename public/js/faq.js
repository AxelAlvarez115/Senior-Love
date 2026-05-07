const accs = document.getElementsByClassName("accordion"); // Use const for elements that won't change

for (let i = 0; i < accs.length; i++) { 
  accs[i].addEventListener("click", function () {
    this.classList.toggle("active");
    this.parentElement.classList.toggle("active");

    const panel = this.nextElementSibling; // Use const for the panel element

    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}