
// modules
const { ipcRenderer } = require("electron");
const items = require("./items");


// Dom nodes
let showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    modal = document.getElementById("modal"),
    addItem = document.getElementById("add-item"),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search');

// Open new item modal
window.newItem = () => {
    showModal.click();
}

// Ref to items.openItem
window.openItem = items.openItem;

// Open item in native browser
window.openItemNative = items.openNative;

// Focus to Search items
window.searchItems = () => {
    search.focus();
}

// Ref to items.deleteItem
window.deleteItem = () => {
    let selectedItem = items.getSelectedItem();
    console.log('window context delete item:', selectedItem);
    items.deleteItem(selectedItem.index);
}

// Filter items with search
search.addEventListener('keyup', e => {
    const searchVal = search.value.toLowerCase();
    const items = document.getElementsByClassName('read-item');
    Array.from(items).forEach( item => {
        let hasMatch = item.innerText.toLowerCase().includes(searchVal);
        item.style.display = hasMatch ? 'flex' : 'none';
    });
})


// Navigate item selection with up/down
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' ) {
        items.changeSelection(e.key);
    }
})

// disable/enable the modal buttons
const toggleModalButtons = () => {
    // check status
    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = "Add Item";
        closeModal.style.display = "inline";
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = "Adding...";
        closeModal.style.display = "none";
    }
}

// show modal
showModal.addEventListener('click', e=>{
    modal.style.display = 'flex';
    itemUrl.focus();
})
// show modal
closeModal.addEventListener('click', e=>{
    modal.style.display = 'none';
})
// Handle new item
addItem.addEventListener('click', e=> {
    // check a url exists
    if (itemUrl.value){
        // console.log(itemUrl.value);
        ipcRenderer.send("new-item", itemUrl.value)

        // disable buttons
        toggleModalButtons();        
    }
})

// listen for keyboard submit
itemUrl.addEventListener('keyup', e=>{
    if( e.key === 'Enter'){
        addItem.click();
    }
});

// listen for new item response from main process
ipcRenderer.on("new-item-success", (e, itemData)=>{

    // console.log("response from main process: ", data);
    // Add new item to "items" node
    items.addItem(itemData, true);

    // enable buttons
    toggleModalButtons();

    // hide modal and clear value
    modal.style.display = 'none';
    itemUrl.value = "";

})
