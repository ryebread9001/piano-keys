const reversedKeyboardNotes = {
    'C': 'a',
    'D': 's',
    'E': 'd',
    'F': 'f',
    'G': 'g',
    'A': 'h',
    'B': 'j',
    'C1': 'k',
    'D1': 'l',
    'E1': ';',
    'F1': "'",
    'C#': 'w',
    'D#': 'e',
    'F#': 't',
    'G#': 'y',
    'A#': 'u',
    'C1#': 'o',
    'D1#': 'p'
};


const keyboardNotes = {
    'a': 'C',
    's': 'D',
    'd': 'E',
    'f': 'F',
    'g': 'G',
    'h': 'A',
    'j': 'B',
    'k': 'C',
    'l': 'D',
    ';': 'E',
    "'": 'F',
    'w': 'C#',
    'e': 'D#',
    't': 'F#',
    'y': 'G#',
    'u': 'A#',
    'o': 'C#',
    'p': 'D#',
};
  

const keyboard = new AudioKeys();
const translator = document.getElementById('translator');
let output = document.getElementById('output');
const sampler = new Tone.Sampler({
	urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
	baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

let jumbo = document.getElementsByClassName('jumbotron')[0];
for (const child of jumbo.children) {
    let key = child.id;
    child.addEventListener('click', (evt)=>{
        const event = new KeyboardEvent('keydown', { key, ctrlKey: false });
        child.dispatchEvent(event);
    });
}

keyboard.down((key)=> {
    if (Tone.context.state != "running") {
        Tone.start();
    }
    sampler.triggerAttack(key.frequency/4);

    let pressedKey = String.fromCharCode(key.keyCode).toLowerCase();
    console.log(key.keyCode);
    let regex = /^[a-zA-Z]$/g;
    let found = pressedKey.match(regex);
    if (found || key.keyCode == 186 || key.keyCode == 222) {
        document.getElementById(pressedKey).classList.add("keyboard-button-focus");
    } else {
        return;
    }
})

keyboard.up((key)=> {
    sampler.triggerRelease();
    let pressedKey = String.fromCharCode(key.keyCode).toLowerCase();
    console.log(key.keyCode);
    let regex = /^[a-zA-Z]$/g;
    let found = pressedKey.match(regex);
    if (found || key.keyCode == 186 || key.keyCode == 222) {
        document.getElementById(pressedKey).classList.remove("keyboard-button-focus");
    } else {
        return;
    }
})


function translate(input) {
    input = input.trim();
    let arr = input.split(",");

    let result = '';
    for (var i = 0; i < arr.length; i ++) {
        arr[i] = arr[i].trim()
        result += reversedKeyboardNotes[arr[i]] + ', ';
    }
    console.log(result)
    output.innerText = result;
}

translator.addEventListener('keydown', (evt) => {
    translate(translator.value);
});

function playNote(note, event) {
    if (Tone.context.state != "running") {
        Tone.start();
    }
    sampler.triggerAttackRelease(note, "8n");
}
