/* ==========================================================================
   ANNOUNCEMENT SPEECH SYNTHESIS (AI VOICE READING)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const btnVoiceEn = document.getElementById('btnVoiceEn');
    const btnVoiceKm = document.getElementById('btnVoiceKm');
    const btnStopVoice = document.getElementById('btnStopVoice');
    
    const synth = window.speechSynthesis;
    let currentUtterance = null;

    // Helper to extract clean text from specific language selectors
    function getArticleText(selector) {
        const elements = document.querySelectorAll(selector);
        let combinedText = "";
        elements.forEach(el => {
            combinedText += el.innerText + ". ";
        });
        return combinedText;
    }

    // Function to speak text with SpeechSynthesis API
    function speakText(text, langCode) {
        if (!('speechSynthesis' in window)) {
            alert('Speech Synthesis (Text-to-Speech) is not supported in your browser.');
            return;
        }

        // Stop any ongoing speech
        synth.cancel();

        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.rate = 0.95; // Speech speed rate
        currentUtterance.pitch = 1.0;

        // Try selecting matching voice for requested language code
        const voices = synth.getVoices();
        const selectedVoice = voices.find(v => v.lang.startsWith(langCode));
        if (selectedVoice) {
            currentUtterance.voice = selectedVoice;
        } else {
            currentUtterance.lang = langCode;
        }

        // Toggle button states on start/end
        currentUtterance.onstart = () => {
            btnStopVoice.style.display = 'inline-block';
        };

        currentUtterance.onend = () => {
            btnStopVoice.style.display = 'none';
        };

        currentUtterance.onerror = () => {
            btnStopVoice.style.display = 'none';
        };

        synth.speak(currentUtterance);
    }

    // Event Listeners for Voice Buttons
    btnVoiceEn.addEventListener('click', () => {
        const textToRead = getArticleText('.en-text');
        speakText(textToRead, 'en');
    });

    btnVoiceKm.addEventListener('click', () => {
        const textToRead = getArticleText('.km-text');
        speakText(textToRead, 'km');
    });

    btnStopVoice.addEventListener('click', () => {
        if (synth) {
            synth.cancel();
            btnStopVoice.style.display = 'none';
        }
    });

    // Populate voice list asynchronously for mobile/Chrome browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => synth.getVoices();
    }
});
