const menu = document.getElementById("menuIcon");
const account = document.getElementById("accountIcon"); 

const menuList = document.getElementById("menu-list");
const accountList = document.getElementById("account-list");

menu.addEventListener("click", () => {
    menuList.classList.toggle("hidden");
    accountList.classList.add("hidden");
});

if (typeof account !== 'undefined' && account !== null) {
    account.addEventListener("click", () => {
        accountList.classList.toggle("hidden");
        menuList.classList.add("hidden");
    });
}