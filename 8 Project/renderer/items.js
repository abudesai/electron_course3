
// modules
const fs = require("fs");
const { shell } = require("electron");


// DOM nodes
let items = document.getElementById("items");
console.log("initial items", items);

// Get readerJS contents
let readerJS = fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];


// listen for done message from reader window
window.addEventListener('message', e => {
    
    // check for correct message
    if (e.data.action === 'delete-reader-item') {
        // delete item at given index
        this.deleteItem(e.data.itemIndex);

        // close the reader window
        e.source.close();

    }

})

// Delete item
exports.deleteItem = itemIndex => {

    console.log("current nodes:", items.childNodes);
    console.log("item just read and to delete:", itemIndex);

    // remove the item from DOM
    items.removeChild( items.childNodes[itemIndex]);

    // Remove from storage
    this.storage.splice(itemIndex,1);

    // persist
    this.saveToLocalStorage();

    // Select previous item or new first item if first was deleted
    if (this.storage.length) {

        // Get new selected item index
        let newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1;
        console.log('new item index after done reading:', newSelectedItemIndex);

        // Set item at new index as selected
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected');
    }

}

// Get selected item index
exports.getSelectedItem = () => {
    // get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    // get item index
    // let itemIndex = 0;
    // let child = currentItem;
    // while( (child = child.previousSibling) != null ) itemIndex++;
    
    let nodes = Array.from(document.getElementsByClassName('read-item'));
    let itemIndex = nodes.indexOf(currentItem);

    // console.log("selected item index:", itemIndex);

    // return selected item and index
    return { node: currentItem, index: itemIndex};
}

// Persist storage
exports.saveToLocalStorage = () => {
    console.log("adding to storage", this.storage)
    localStorage.setItem('readit-items', JSON.stringify(this.storage) )
};

// Set item as selected
exports.selectItem = e => {
    // Remove currently selected item class
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected');
    e.currentTarget.classList.add('selected');
    // console.log('applying selection', e.currentTarget);
}

// Move to newly selected item
exports.changeSelection = direction => {
    // Get current selected item
    let currentItem = this.getSelectedItem().node;

    // Handle up/down
    if (direction === 'ArrowUp' && currentItem.previousSibling) {
        console.log(currentItem.previousSibling);
        currentItem.classList.remove('selected');
        currentItem.previousSibling.classList.add('selected');
    }

    if (direction === 'ArrowDown' && currentItem.nextSibling) {
        currentItem.classList.remove('selected');
        currentItem.nextSibling.classList.add('selected');
    }
}

// Open item in native browser
exports.openNative = () => {
    // Only if we have items
    if (!this.storage.length) return

    // Get selected item
    let selectedItem = this.getSelectedItem();

    // Open in system brower using shell module
    shell.openExternal(selectedItem.node.dataset.url);
}

// Open selected item
exports.openItem = () => {
    if (!this.storage.length) return

    // Get selected item
    let selectedItem = this.getSelectedItem();

    // Get selected item's URL
    let contentURL = selectedItem.node.dataset.url;
    // console.log('url:', contentURL);

    // open item in proxy browser window
    let readerWindow = window.open(contentURL, '', `
        maxWidth = 2000,
        maxHeight = 2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `);

    // Inject Javascript with specific item index (selectedItem.index)
    readerWindow.eval(readerJS.replace('{{index}}', selectedItem.index));
}

// Add new item
exports.addItem = (itemData, isNew = false) => {
    // create a new html node
    let itemNode = document.createElement('div');

    // assign "read-item" class
    itemNode.setAttribute('class', 'read-item');

    // Set url as data attribute
    itemNode.setAttribute('data-url', itemData.url);


    let htmlContent = `<img src=${itemData.screenshot}>`;
    htmlContent += `<h2>${itemData.title}</h2>`;

    itemNode.innerHTML = htmlContent;

    // console.log("specific child node being added:", htmlContent);

    // append new node to "items"
    items.appendChild(itemNode);

    // Attach click handler to select
    itemNode.addEventListener('click', this.selectItem);

    // Attach doubleclick handler to open item
    itemNode.addEventListener('dblclick', this.openItem);

    // if this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1){
        itemNode.classList.add('selected');
    }

    if (isNew){
        this.storage.push(itemData);
        this.saveToLocalStorage();
    }
    
}

// Add items fro storage when app loads
this.storage.forEach( item => {
    this.addItem(item);
})

