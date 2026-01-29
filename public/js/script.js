/* ***********************************
 * Show/Hide Password
 * ****************************** */
const pswdBtn = document.querySelector("#passwordBtn");
pswdBtn.addEventListener("click", function () {
  let passwordInput = document.getElementById("password");
  let type = passwordInput.getAttribute("type");
  if (type == "password") {
    passwordInput.setAttribute("type", "text");
    passwordBtn.innerHTML = "Hide Password";
  } else {
    passwordInput.setAttribute("type", "password");
    passwordBtn.innerHTML = "Show Password";
  }
});
