// Create input box and submit button globally
const inputBox = document.createElement("input");
inputBox.type = "text";
inputBox.id = "next-word";
inputBox.placeholder = "Enter next word";

const submitButton = document.createElement("button");
submitButton.textContent = "Submit";
submitButton.id = "submit-button";

console.log("inputBox created:", inputBox);
console.log("submitButton created:", submitButton);

// Fixed word ladder for the day
const wordLadder = ["HEAD", "HEAL", "TEAL", "TELL", "TALL", "TAIL"];
let currentWordIndex = 1; // Start input at the second lowest rung (HEAL)
let stepCount = 0;
let wrongAttempts = 0; // Counter for incorrect attempts
const guessedWords = []; // Array to store correct guesses
let expectedAttempts = 5;

// DOM Elements
const rungs = document.querySelectorAll('.rung');
const messageElement = document.getElementById("message");
const stepCountElement = document.getElementById("step-count");
const modal = document.getElementById("game-modal");
const modalMessage = document.getElementById("modal-message");
const closeModalButton = document.getElementById("close-modal");

if (!rungs.length || !messageElement || !stepCountElement || !modal) {
    console.error("Critical DOM elements not found. Ensure correct HTML structure.");
}

// Attach submitWord globally to input box and submit button
submitButton.addEventListener("click", submitWord);
inputBox.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitWord();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const howToPlayModal = document.getElementById("how-to-play-modal");
    const closeButton = document.getElementById("close-how-to-play");
    const gameModal = document.getElementById("game-modal"); // Game-over modal

    // Show the "How to Play" modal when the page loads
    howToPlayModal.style.display = "flex";
    gameModal.style.display = "none";

    // Close the modal when the user clicks the close button
    closeButton.addEventListener("click", function () {
        howToPlayModal.style.display = "none";
    });
});


// Function to render hearts based on remaining tries
function renderHearts() {
    const heartsContainer = document.getElementById("hearts-container");
    heartsContainer.innerHTML = ""; // Clear existing hearts

    for (let i = 0; i < (expectedAttempts - wrongAttempts); i++) {
        const heart = document.createElement("span");
        heart.classList.add("heart");
        heart.innerHTML = '<i class="fas fa-heart"></i>'; // Font Awesome heart
        heartsContainer.appendChild(heart);
    }
}

// Call this function at the start to display initial hearts
renderHearts(); 

// Function to show the modal with a message
function showModal(message) {

    
    // Calculate words guessed correctly as a fraction
    const totalWords = wordLadder.length - 2; // Exclude "HEAD" and "TAIL"
    const wordsGuessed = guessedWords.length;

    const shareMessage = 
        `*${message}*\n
        *Steps Taken:* ${stepCount}\n
        *Words Guessed:* ${wordsGuessed}/${totalWords}\n
        *Can you beat my score? Try the Word Ladder Game now!*`;

    modalMessage.innerHTML = `
        ${message}<br><br>
        Steps Taken: ${stepCount} <br>
        Words Guessed: ${wordsGuessed}/${totalWords}
        `;

    // WhatsApp Share Button
        const whatsappShareButton = document.getElementById("whatsapp-share");
        const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURI(shareMessage)}`;
        whatsappShareButton.onclick = () => {
            window.open(whatsappURL, "_blank");
        };

    modal.style.display = "flex";

    // Close the game-over modal
        document.getElementById("close-modal").addEventListener("click", function () {
            gameModal.style.display = "none";
        });

}

// Function to place input and button at the current rung
function positionInputAtRung(index) {
    console.log(`Positioning input at rung index: ${index}`); // Debugging

    const currentRung = rungs[index];

    if (!currentRung) {
        console.error("Rung element not found at index:", index);
        return;
    }

    console.log("Appending inputBox and submitButton to rung:", index);

    // Clear only the interactive area to prevent duplicate input
    currentRung.innerHTML = ""; // Clear the rung completely

    // Append input box and button
    currentRung.appendChild(inputBox);
    currentRung.appendChild(submitButton);

    inputBox.value = ""; // Clear input
    inputBox.focus();    // Set focus on input box

}

// Function to validate the entered word
function submitWord() {
    const enteredWord = inputBox.value.toUpperCase().trim();
    const expectedWord = wordLadder[currentWordIndex];

    console.log(`submitWord function called | Entered: ${enteredWord}, Expected: ${expectedWord}`);

    if (enteredWord === expectedWord) {
        guessedWords.push(enteredWord); // Add correct word to guessed list
    
        // Replace the input box and button with the correct word
        rungs[currentWordIndex].innerHTML = `<div>${enteredWord}</div>`;
        rungs[currentWordIndex].classList.add("completed");
    
        // Update steps taken
        stepCount++;
        stepCountElement.textContent = stepCount;
    
        // Move to the next rung
        currentWordIndex++;
        if (currentWordIndex < wordLadder.length - 1) {
            positionInputAtRung(currentWordIndex);
        } else {
            // Game completed
            console.log("Game Over: Word ladder completed.");
            messageElement.textContent = "Congratulations! You completed the word ladder.";
            showModal("🎉 Congratulations! You completed the word ladder!");
            inputBox.remove();
            submitButton.remove();
        }
    }
    else {
        wrongAttempts++;
        messageElement.textContent = `Chance : ${expectedAttempts - wrongAttempts} left.`;
        stepCount++;
        stepCountElement.textContent = stepCount;
        renderHearts(); 

        if (wrongAttempts >= expectedAttempts) {
            showModal("Thanks for playing! Better luck next time.");
            inputBox.remove();
            submitButton.remove();
        }
    }

    inputBox.value = ""; // Clear the input field after every attempt
}

// Initialize the game
function initGame() {
    console.log("Initializing the game...");
    stepCountElement.textContent = stepCount;
    positionInputAtRung(currentWordIndex);
    console.log("Game initialized.");
}

initGame();
