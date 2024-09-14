let currentColorIndex = 0;
let currentPoints = 0;
let wikiBase = "https://en.wikipedia.org/wiki/";
const colors = ['#D3B5FA', '#C3B5FA', '#B5C4FA'];
let nextIsClickable = false;
let noIsClickable = true;
let yesIsClickable = true;
let currentWordData = null; // Store the current word data
const answerLinkSpan = document.getElementById('answerLink');

function changeBackgroundColor() {
    document.body.style.backgroundColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

setInterval(changeBackgroundColor, 3000)

async function fetchWord() {
    const files = ['real.txt', 'fake.txt'];
    const randomFile = files[Math.floor(Math.random() * files.length)];
    try {
        const response = await fetch(randomFile);
        const words = await response.text().then(text => text.split('\n'));
        const randomWord = words[Math.floor(Math.random() * words.length)];
        return { word: randomWord, file: randomFile };
    } catch (error) {
        console.error("Error fetching word:", error);
        return null;
    }
}

// Check if a word exists in a specific file
async function checkWord(word, file) {
    try {
        const response = await fetch(file);
        const words = await response.text().then(text => text.split('\n'));
        return words.includes(word);
    } catch (error) {
        console.error("Error checking word:", error);
        return false;
    }
}

// Initialize the game
async function initGame() {
    currentWordData = await fetchWord(); // Fetch word data on initialization
    if (currentWordData) {
        document.getElementById('word').textContent = currentWordData.word;
        document.getElementById('yes').addEventListener('click', () => checkAnswerYes());
        document.getElementById('no').addEventListener('click', () => checkAnswerNo());
        document.getElementById('next').addEventListener('click', () => reloadGame());
        document.getElementById('next').style.display = 'none';
        document.getElementById('answer').style.display = 'none';
        document.getElementById('answerDesc').style.display = 'none';
        document.getElementById('answerLink').style.display = 'none';
    } else {
        console.error("Error initializing the game. Could not fetch a word.");
    }
}

async function reloadGame(){
    currentWordData = await fetchWord();
    if (currentWordData) {
        document.getElementById('word').textContent = currentWordData.word;
        document.getElementById('next').style.display = 'none';
        document.getElementById('answer').style.display = 'none';
        document.getElementById('answerDesc').style.display = 'none';
        document.getElementById('answerLink').style.display = 'none';
        noIsClickable = true;
        yesIsClickable = true;
    } else {
        console.error("Error reloading the game. Could not fetch a word.");
    }
}

// Check the answer and update the feedback
async function checkAnswerNo() {
    if(noIsClickable === true){
        noIsClickable = false;
        yesIsClickable = false;
        const isReal = await checkWord(currentWordData.word, 'real.txt'); // Use currentWordData
        const answerSpan = document.getElementById('answer');
        const answerDescSpan = document.getElementById('answerDesc');

        if (isReal) {
            answerSpan.style.display = 'inline';
            answerSpan.textContent = 'Wrong!';
            answerDescSpan.style.display = 'inline';
            answerDescSpan.textContent = 'This word is a real word.';
            document.getElementById('next').style.display = 'none';
            answerLinkSpan.href = wikiBase + currentWordData.word; 
            answerLinkSpan.textContent = "Here is a wikipedia link to it.";
            answerLinkSpan.style.display = 'inline';
        } else {
            answerSpan.style.display = 'inline';
            answerDescSpan.style.display = 'inline';
            answerSpan.textContent = 'Right!';
            answerDescSpan.textContent = 'This word is not a real word. It was algorithmically generated.';
            currentPoints = currentPoints + 1;
            document.getElementById('pointsCounter').textContent = currentPoints;
            document.getElementById('next').style.display = 'inline';
        }
    }
}

async function checkAnswerYes() {
    if(yesIsClickable === true){
        yesIsClickable = false;
        noIsClickable = false;
        const isReal = await checkWord(currentWordData.word, 'real.txt'); // Use currentWordData
        const answerSpan = document.getElementById('answer');
        const answerDescSpan = document.getElementById('answerDesc');

        if (isReal) {
            answerSpan.style.display = 'inline';
            answerDescSpan.style.display = 'inline';
            document.getElementById('answerLink').attr
            answerSpan.textContent = 'Right!';
            answerDescSpan.textContent = 'This word is a real word.';
            currentPoints = currentPoints + 1;
            document.getElementById('pointsCounter').textContent = currentPoints;
            document.getElementById('next').style.display = 'inline';
            answerLinkSpan.href = wikiBase + currentWordData.word; 
            answerLinkSpan.textContent = "Here is a wikipedia link to it.";
            answerLinkSpan.style.display = 'inline';
        } else {
            answerSpan.style.display = 'inline';
            answerDescSpan.style.display = 'inline';
            answerSpan.textContent = 'Wrong!';
            answerDescSpan.textContent = 'This word is not a real word. It was algorithmically generated.';
            document.getElementById('next').style.display = 'none';
        }
    }
}

// Start the game when the page loads
window.onload = initGame;