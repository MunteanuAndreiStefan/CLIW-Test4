var listOfElements;
let butonAdd = document.getElementById("addButton");
let butonReset = document.getElementById("resetButton");
let butonBlankSpace = document.getElementById("addBlankSpace");

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function editElement(id) {
    var text = prompt("new value");
    console.log(listOfElements);
    if (!isBlank(text) && !text.isEmpty(text))
        listOfElements[id].textValue = text;
    else
        alert("You can't modify to a blank space!");
    setLocal(JSON.stringify(listOfElements));
    window.location.replace('index.html');
}

function removeElement(id) {
    delete listOfElements[id];
    setLocal(JSON.stringify(listOfElements));
    window.location.replace('index.html');
}

function displayReminders() {
    let listLength = Object.keys(listOfElements).length;
    console.log(listLength + " listOfElementsects:");
    let displayedList = document.getElementById("list");
    let keys = Object.keys(listOfElements);

    for (let i = 0; i < listLength; i++) {
        var listItem = document.createElement("li");
        var text = document.createTextNode(listOfElements[keys[i]].textValue);
        listItem.id = keys[i] + "e";
        listItem.ondblclick = function(evt) {
            var source = evt.srcElement || evt.originalTarget
            console.log(source.id.substring(0, source.id.length - 1));
            editElement(source.id.substring(0, source.id.length - 1));
        }

        listItem.appendChild(text);


        var newButton = document.createElement("button");

        newButton = document.createElement("button");
        newButton.className = "buttonRemove";
        newButton.innerText = "\u00D7";
        newButton.id = keys[i] + "b";

        newButton.onclick = function(evt) {
            var source = evt.srcElement || evt.originalTarget
            console.log(source.id);
            removeElement(source.id.substring(0, source.id.length - 1));
        }

        listItem.appendChild(newButton);
        displayedList.appendChild(listItem);
        listItem.setAttribute('draggable', true);
        listItem.className = "column";
        console.log(i + ": " + listOfElements[keys[i]].textValue);


    }
    var dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        this.classList.add('dragElem');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.classList.add('over');

        e.dataTransfer.dropEffect = 'move';

        return false;
    }

    function handleDragEnter(e) {
        e.preventDefault();
    }

    function handleDragLeave(e) {
        this.classList.remove('over'); // this / e.target is previous target element.
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation(); // Stops some browsers from redirecting.
        }

        if (dragSrcEl != this) {
            dragSrcEl.parentNode.removeChild(dragSrcEl);
            var dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin', dropHTML);
            var dropElem = this.previousSibling;
            addDnDHandlers(dropElem);

        }
        this.classList.remove('over');
        return false;
    }

    function handleDragEnd(e) {
        // this/e.target is the source node.
        this.classList.remove('over');

        /*[].forEach.call(cols, function (col) {
          col.classList.remove('over');
        });*/
    }

    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false)
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop', handleDrop, false);
        elem.addEventListener('dragend', handleDragEnd, false);
    }

    var cols = document.querySelectorAll('#list .column');
    [].forEach.call(cols, addDnDHandlers);
    console.log(cols);

}

function setLocal() {
    window.localStorage.setItem("myToDoList", JSON.stringify(listOfElements));
}

function getLocal() {
    var intro = window.localStorage.getItem("myToDoList");
    if (intro != null) listOfElements = JSON.parse(intro);
    else listOfElements = new Object();
}

butonAdd.onclick = function() {
    let listLength = Object.keys(listOfElements).length;
    listLength++;
    let newObj = {
        status: "offline",
        timestamp: (new Date()).getTime(),
        textValue: document.getElementById("textInput").value
    };
    listOfElements["item" + listLength] = newObj;
    setLocal(JSON.stringify(listOfElements));
}

butonReset.onclick = function() {
    listOfElements = new Object();
    setLocal(JSON.stringify(listOfElements));
}

butonBlankSpace.onclick = function() {
    let listLength = Object.keys(listOfElements).length;
    listLength++;
    let newObj = {
        status: "offline",
        timestamp: (new Date()).getTime(),
        textValue: "           "
    };
    listOfElements["item" + listLength] = newObj;
    setLocal(JSON.stringify(listOfElements));
}

getLocal();
displayReminders();