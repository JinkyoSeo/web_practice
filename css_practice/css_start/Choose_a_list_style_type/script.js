const container = document.querySelector(".container");
container.addEventListener("change", (event) => {
  const list = document.querySelector("ol");
  list.setAttribute("style", `list-style-type: ${event.target.value}`);
});
