

// Create button in remote content to mark iten as "done"
let readitClose = document.createElement('div');
readitClose.innerText = 'Done';

// Style this button
readitClose.style.position='fixed';
readitClose.style.bottom = '15px';
readitClose.style.right = '15px';
readitClose.style.padding = '5px 10px';
readitClose.style.fontSize = '20px';
readitClose.style.fontWeight = 'bold';
readitClose.style.backgroundColor = 'dodgerblue';
readitClose.style.color = 'white';
readitClose.style.borderRadius = '5px';
readitClose.style.cursor = 'pointer';
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';

// Attach click handler
readitClose.onclick = e => {
    // message parent (opener) window
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: {{index}}
    }, '*');
}

// Append button to body
document.getElementsByTagName('body')[0].appendChild(readitClose);



