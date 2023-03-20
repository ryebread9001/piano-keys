
var idNum = 0;
var postsMade = [];
var user = "";
function update() {
	fetch("http://lyssie.org/chat")
	.then((resp) => {
		return resp.json();
	}).then((data) => {
		if (idNum == 0) idNum = data.length;

		for (var i = 0; i < data.length; i++) {
			if (!postsMade.includes(data[i].id)) {
				makePostIt(data[i], i);
				
				postsMade.push(data[i].id);
			}
		}
	});
}

function makePostIt(data, i) {
	var chatDiv = document.getElementById('chat');
	var header = document.createElement('div');
	header.classList.add("postheader")
	header.id = i + "header";
	var title = document.createElement('h3');
	title.innerHTML = data.username;
	header.appendChild(title);

	var postit = document.createElement('div');
	postit.classList.add("post");
	postit.id = i; 
	var note = document.createElement('p');
	note.innerText = data.msg;
	postit.appendChild(header);
	postit.appendChild(note);
	randPos(postit);
	chatDiv.append(postit);
	dragElement(postit);
			
}

window.addEventListener("load", (event) => {
	update();
	user = (user=="") ? prompt('Enter your name') : user;
});

function send() {
	const input = document.getElementById("chat-box").value;
	
	fetch('http://lyssie.org/send/?' + new URLSearchParams({
    username: user,
    msg: input,
	id: idNum++
	}))
	.then((resp) => {
		console.log(resp);
		update();
	})
}

function clearChats() {
	console.log("CLEARING");
	var chatDiv = document.getElementById('chat');
	chatDiv.innerHTML = "";
	fetch('http://lyssie.org/clear').then((resp) => {console.log(resp)});
}

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
	  /* if present, the header is where you move the DIV from:*/
	  document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
	  /* otherwise, move the DIV from anywhere inside the DIV:*/
	  elmnt.onmousedown = dragMouseDown;
	}
  
	function dragMouseDown(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // get the mouse cursor position at startup:
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  document.onmouseup = closeDragElement;
	  // call a function whenever the cursor moves:
	  document.onmousemove = elementDrag;
	}
  
	function elementDrag(e) {
	  e = e || window.event;
	  e.preventDefault();
	  // calculate the new cursor position:
	  pos1 = pos3 - e.clientX;
	  pos2 = pos4 - e.clientY;
	  pos3 = e.clientX;
	  pos4 = e.clientY;
	  // set the element's new position:
	  elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	  elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}
  
	function closeDragElement() {
	  /* stop moving when mouse button is released:*/
	  document.onmouseup = null;
	  document.onmousemove = null;
	}
  }

function randPos(elem) {
	var posx = (Math.floor(Math.random() * 500)+150).toFixed();
    var posy = (Math.floor(Math.random() * 500)+150).toFixed();

    elem.style.top = posy+"px";
	elem.style.left = posx+"px";
}
  


