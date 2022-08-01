var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();


var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = $('#editor').text();

var noteTextarea = $('#editor');
//var note = $('#editor').text();
//var x = note + noteContent;
//noteTextarea.val(x);
//$('#editor').text(x)

var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition 
------------------------------*/

recognition.continuous = true;


recognition.onresult = function(event) {

    var current = event.resultIndex;

    var transcript = event.results[current][0].transcript;


    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if (!mobileRepeatBug) {
        noteContent += transcript;
        $('#editor').text(noteContent)
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {


    if ($(this).text() == "Stop Recording") {
        $(this).html("Start Recording");
        $("#instructions").html("");
        recognition.stop();
    } else {
        $(this).html("Stop Recording");
        $("#instructions").html("Voice Recognition is on");
        if (noteContent.length) {
            noteContent += ' ';
        }
        recognition.start();
    }


});


$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $('#editor').text();
})

$('#save-note-btn').on('click', function(e) {
    recognition.stop();

    if (!noteContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    } else {
        // Save note to localStorage.
        saveNote(new Date().toLocaleString(), noteContent);

        // Reset variables and update UI.
        noteContent = '';
        renderNotes(getAllNotes());
        $('#editor').text(noteContent)
        instructions.text('Note saved successfully.');
    }

})


notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);

    // Listen to the selected note.
    if (target.hasClass('listen-note')) {
        var content = target.closest('.note').find('.content').text();
        readOutLoud(content);
    }

    // Delete note.
    if (target.hasClass('delete-note')) {
        var dateTime = target.siblings('.date').text();
        deleteNote(dateTime);
        target.closest('.note').remove();
    }
});



/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}



/*-----------------------------
      Helper Functions 
------------------------------*/

function renderNotes(notes) {
    var html = '';
    if (notes.length) {
        notes.forEach(function(note) {
            html += `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;
        });
    } else {
        html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
}


function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
}


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        console.log(i)
        console.log(key)

        if (key.substring(0, 5) == 'note-') {
            notes.push({
                date: key.replace('note-', ''),
                content: localStorage.getItem(localStorage.key(i))
            });
        }
    }
    console.log(notes)
    return notes;
}


function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
}







function makeBold() {
    document.execCommand("bold");
    if (document.getElementById("bold").isToggled) {
        document.getElementById("bold").style.backgroundColor = "#00cc55";
        document.getElementById("bold").isToggled = false;
    } else {
        document.getElementById("bold").style.backgroundColor = "#008833";
        document.getElementById("bold").isToggled = true;
    }
}

function makeItalic() {
    document.execCommand("italic");
    if (document.getElementById("italic").isToggled) {
        document.getElementById("italic").style.backgroundColor = "#00cc55";
        document.getElementById("italic").isToggled = false;
    } else {
        document.getElementById("italic").style.backgroundColor = "#008833";
        document.getElementById("italic").isToggled = true;
    }
}

function doUnderline() {
    document.execCommand("underline");
    if (document.getElementById("underline").isToggled) {
        document.getElementById("underline").style.backgroundColor = "#00cc55";
        document.getElementById("underline").isToggled = false;
    } else {
        document.getElementById("underline").style.backgroundColor = "#008833";
        document.getElementById("underline").isToggled = true;
    }
}

function doAddImage() {
    var image_url = prompt("Image URL:");
    if (image_url != "") {
        document.execCommand("insertImage", false, image_url);
    } else {
        alert("You must set a URL!");
    }
}

function justifyLeft() {
    document.execCommand("justifyLeft");
}

function justifyCenter() {
    document.execCommand("justifyCenter");
}

function justifyRight() {
    document.execCommand("justifyRight");
}

function doSetTextColor() {
    var text_color = prompt("CSS Color:");
    if (text_color != "") {
        document.execCommand("foreColor", false, text_color);
    } else {
        alert("You must set a Color!");
    }
}