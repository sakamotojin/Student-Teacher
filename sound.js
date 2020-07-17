var idx = 0 ;
var notes_arr = {};
try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}
catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}
var total_content;
var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
var notes = getAllNotes();
renderNotes(notes);



/*-----------------------------
      Voice Recognition
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function(event) {

    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    var current = event.resultIndex;

    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;

    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

    if(!mobileRepeatBug) {
        noteContent += transcript;
        noteTextarea.val(noteContent);
    }
};

recognition.onstart = function() {
    instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
    instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
        instructions.text('No speech was detected. Try again.');
    };
}



/*-----------------------------
      App buttons and input
------------------------------*/

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
});


$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
})

$('#save-note-btn').on('click', function(e) {
    recognition.stop();

    if(!noteContent.length) {
        instructions.text('Could not save empty note. Please add a message to your note.');
    }
    else {
        // Save note to localStorage.
        // The key is the dateTime with seconds, the value is the content of the note.
        saveNote(noteContent);

        // Reset variables and update UI.
        noteContent = '';
        renderNotes(getAllNotes());
        noteTextarea.val('');
    }

})


notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);

    // Listen to the selected note.
    if(target.hasClass('listen-note')) {
        var content = target.closest('.note').find('.content').text();
        readOutLoud(content);
    }

    // Delete note.
    if(target.hasClass('delete-note')) {
        var dateTime = target.siblings('.date').text();
        deleteNote(dateTime);
        target.closest('.note').remove();
    }
});
$('#clear-note-btn').on('click', function(e) {
    noteContent = '';
    noteTextarea.val(noteContent);
});



/*-----------------------------
      Speech Synthesis
------------------------------*/
/*-----------------------------
      Helper Functions
------------------------------*/

function renderNotes(notes) {
    var html = '';
    var cnt = 1;
    if(notes.length) {
        notes.forEach(function(note) {
            html+= `<li class="note"> ${cnt} .  &nbsp ${note}
      </li>`;
            cnt = cnt + 1;
        });
    }
    else {
        html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
}


function saveNote(content) {
    notes_arr[idx] = content;
    idx = idx+1;
}


function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < idx; i++) {
            notes.push(notes_arr[i]);
        }
    return notes;
}

function finalsub() {
    localStorage.setItem("notes", JSON.stringify(notes_arr));
}