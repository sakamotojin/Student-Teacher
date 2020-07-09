(function(document) {
    'use strict';

    function $(selector) {
        return document.querySelector(selector);
    }

    window.addEventListener('WebComponentsReady', function() {

       
        var mathInput = $('#mathInput');
        var mathButton = $('#mathButton');
        var writeHere = $('.write-here');

        if ( mathInput.applicationkey === "REPLACE_ME" ||
            mathInput.hmackey === "REPLACE_ME") {
            $('header').remove();
            $('.warningkeys').classList.remove('hidden');
        } else {

            var listOfInputs = [mathInput];
            listOfInputs.forEach(function(input) {
                input.addEventListener('loaded', function() {
                    writeHere.classList.remove('hidden');
                });
                input.addEventListener('pointerdown', function() {
                    writeHere.classList.add('hidden');
                });
                input.addEventListener('pointerup', function() {
                    writeHere.classList.add('hidden');
                });
            });
            writeHere.addEventListener('pointermove', function() {
                writeHere.classList.add('hidden');
            });

            // Manage the tap on the various buttons
            var setButtonsStates = function(isMathButton) {
                writeHere.classList.add('hidden');
                listOfInputs.forEach(function(input) { input.classList.add('hidden'); });

                mathButton.active = isMathButton;
                if (isMathButton) {
                    mathInput.classList.remove('hidden');
                    mathInput.removeAttribute('unloaded');
                }

            };

            mathButton.addEventListener('tap', function() {
                setButtonsStates( true);
            });
            // Initialize the default demo
            setButtonsStates(true);
        }
    });

})(document);