const label = document.querySelectorAll("label");
const input = document.querySelectorAll("input");
const container = document.querySelectorAll(".container");
const eyes = document.querySelectorAll("i.fa-eye-slash");
const passInput = document.querySelectorAll("input[type='password']");

document.addEventListener("DOMContentLoaded", () => {
    input[0].focus();
});
for (let i = 0; i < input.length; i++) {
    input[i].addEventListener("focus", () => {
        label[i].style.zIndex = 2;
        container[i].style.backgroundColor = "#fff78a63";
        container[i].style.borderColor = "#EE7214";
        label[i].style.backgroundColor = "#EE7214";
        label[i].style.color = "white";
        label[i].style.top = "-23%";
    });
    input[i].addEventListener("blur", () => {
        if (input[i].value == "") {
            label[i].style.zIndex = -1;
            label[i].style.top = "29%";
            label[i].style.color = "black";
            label[i].style.background = "transparent";
            container[i].style.borderColor = "gray";
            container[i].style.background = "transparent";
        }
    });
}

for (let i = 0; i < eyes.length; i++) {
    eyes[i].addEventListener("click", () => {
        if (eyes[i].classList.contains("fa-eye-slash")) {
            eyes[i].classList.remove("fa-eye-slash");
            eyes[i].classList.add("fa-eye");
            passInput[i].type = "text";
        } else {
            eyes[i].classList.remove("fa-eye");
            eyes[i].classList.add("fa-eye-slash");
            passInput[i].type = "password";
        }
    })
}
