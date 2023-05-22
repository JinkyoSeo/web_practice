const list = document.createElement('ul');
const info = document.createElement('p');
const html = document.querySelector('html');

info.textContent = "Below is a dynamic list. Click anywhere on thpage to add a new list item.list item to change its text to something else.";

document.body.appendChild(info);
document.body.appendChild(list);

html.onclick = function() {
    
    const listItem = document.createElement('li');
    const listContent = prompt('What content do you want the list item to have?');
    listItem.textContent = listContent;
    list.appendChild(listItem);

    listItem.onclick = function(e)
    {
        e.stopPropagation();
        const listContent = prompt('Enter nnew content for yout list item');
        this.textContent = listContent;
    }
}