const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const wordList = require("./words.json");
const bot = new Discord.Client({
	disableEveryone: true
});

//Global Variables
let word;
let letter;
let lWord = [];
let charLength;
let txt = [];
let outputTxt;
let misscount;
let misses = 0;
let succes;
let guessedWord;

bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setActivity("Hangman with y'all");
});


bot.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];


	//!word [INSERT WORD] --> Sets a word of your choosing
	if (cmd === `${prefix}word`) {
		word = messageArray[1];
		message.delete(100); //deletes the message to hide the word
		startGame();
	}

	//!reset --> Resets the game
	else if (cmd === `${prefix}reset`) {
		reset();
	}

	//!letter [INSERT LETTER] --> Tries a letter
	else if (cmd === `${prefix}letter`) {
		letter = messageArray[1];
		tryletter();
	}

	//!random --> Chooses a random word
	else if (cmd === `${prefix}random`) {
		generateWord();
	}

	//!guess [INSERT WORD] --> Guess word
	else if (cmd === `${prefix}guess`) {
		guessedWord = messageArray[1];
		guessWord();
	}

	//START GAME 
	function startGame() {
		lWord = word.split("");
		charLength = lWord.length;

		for (i = 0; i < charLength; i++) {
			txt[i] = "?"
		}

		outputTxt = txt.join(" ");
		txtOutput();
	}

	//DISPLAY WORD IN ? 
	function txtOutput() {
		return message.channel.send(outputTxt || "The game has been reset!");
	}

	//TRY LETTER 
	function tryletter() {
		misscount = 0;

		for (i = 0; i < charLength; i++) {
			if (letter === lWord[i]) {
				txt[i] = letter;
				misscount = 0;
			} else {
				misscount++;
			}

			if (misscount === charLength) {
				misscount = 0;
				misses++;
				lostCheck();
			}
		}

		winCheck();
		outputTxt = txt.join(" ");
		if (misses < 8) {
			return message.channel.send(outputTxt || "The game has been reset!");
		}
	}

	//CHECK IF WON 
	function winCheck() {
		succes = 0;

		for (i = 0; i < charLength; i++) {
			if (txt[i] === lWord[i]) {
				succes++
			} else {
				succes = 0;
			}
		}

		if (succes === charLength) {
			succes = 0;
			for (i = 0; i < charLength; i++) {
				if (txt[i] === lWord[i]) {
					succes++
				} else {
					succes = 0;
				}
			}

			if (succes === charLength && charLength > 0) {
				succes = 0;
				message.channel.send("You have won, the word was " + word + "!");
				reset();
			}
		}
	}

	// CHECK IF LOST 
	function lostCheck() {
		if (misses > 0 && misses < 8) {
			return message.channel.send("You have made " + misses + "/8 mistakes!");
		} else if (misses === 8) {
			message.channel.send("You lost, the word was " + word + "!");
			reset();
		}
	}

	// RESETS GAME 
	function reset() {
		word = "";
		letter = "";
		lWord = [];
		charLength = 0;
		txt = [];
		outputTxt = "";
		misscount = 0;
		misses = 0;
		succes = 0;
		guessedWord = "";
	}

	//CHOOSES A RANDOM WORD FROM THE WORDS ARRAY 
	function generateWord() {
		word = wordList.words[Math.floor(Math.random() * wordList.words.length)];
		startGame();
	}

	//GUESS A WORD 
	function guessWord() {
		if (guessedWord === word) {
			message.channel.send("You have won, the word was " + word + "!");
			reset();
		} else {
			misses++;
			message.channel.send("Incorrect guess, you have made " + misses + "/8 mistakes!");
			lostCheck();
		}
	}
});

// LOG BOT IN 
bot.login(botconfig.token);