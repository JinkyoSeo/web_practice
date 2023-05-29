window.onload = function () {
    const select = document.querySelector("select");
const html = document.querySelector("html");

function update(bgColor, textColor) {
    html.style.backgroundColor = bgColor;
    html.style.color = textColor;
}

select.addEventListener("change", () =>
select.value === "black" ? update("black", "white") : update("white", "black")
);


}