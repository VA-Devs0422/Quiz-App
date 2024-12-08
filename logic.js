let screen = document.querySelector(".screen");
let buttons = document.querySelectorAll(".btn");
let foot = document.querySelector(".foot");
let p = document.querySelector(".p");
let p2 = document.querySelector(".p2");
let startButton = document.querySelector(".startBtn");
let container = document.querySelector(".container");
let loader = document.querySelector(".loader");
let resultArea = document.querySelector(".resultArea");
let currentIndex = 0;
let score = 0;
let quizData;
let bigBox = document.querySelector(".bigContainer")
// getting hold of the next button in global scope
let nextBtn = document.querySelector(".next");
// DOMParser is used for parsing encoded strings 
const parser = new DOMParser();
// console.log(screen)

function fetchApi() {
    let a = "https://opentdb.com/api.php?amount=10&type=multiple";
    return fetch(a)
        .then((response) => {
            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((error) => {
            console.error("Failed to fetch API ", error);
            throw error;
        });
}
// seperate function for displaying data
function displayData() {
    if (currentIndex < quizData.results.length) {
        let buttonsArr = [];
        // this is how you use can DOM Parser
        let correctAns = parser.parseFromString(
            quizData.results[currentIndex].correct_answer,
            "text/html"
        ).documentElement.textContent;
        screen.innerText = parser.parseFromString(
            quizData.results[currentIndex].question,
            "text/html"
        ).documentElement.textContent; //Logic to push the current question text into the screen
        buttonsArr.push(correctAns); // pushing options to the array of buttons i.e correct answer

        /*Pushing the remaining incorrect options to array of buttons*/
        quizData.results[currentIndex].incorrect_answers.forEach((ans) => {
            buttonsArr.push(
                parser.parseFromString(ans, "text/html").documentElement
                    .textContent
            );
        });

        buttonsArr = buttonsArr.sort(() => Math.random() - 0.5); //Randomising the options in the buttons array
        // har next pe khali kar do
        p.innerText = "";
        /* Loop statement to assign elements of array of buttons into the buttons of options and check the correct answer*/
        buttons.forEach((button, i) => {
            button.innerText = buttonsArr[i];

            button.onclick = () => {
                console.log("Button text:", button.innerText);
                console.log(
                    "Decoded Correct Answer:",
                    quizData.results[currentIndex].correct_answer
                );
                if (button.innerText === correctAns) {
                    score++;
                    console.log("Correct! Score:", score);

                    p.innerText = `Correct Answer`;
                    // turn text green and red as correct or incorrect answer
                    p.style.color = "green"
                    p2.innerText = `Current Score is ${score}`;
                } else {
                    console.log("Wrong Answer");
                    p.innerText = "Wrong Answer";
                    p.style.color = "red"
                }

                //Disabling button after click
                buttons.forEach((btn) => {
                    btn.disabled = true;
                    // turn button green and red as correct or incorrect answer
                    if (btn.innerText === correctAns) {
                        btn.style.backgroundColor = "rgb(208 255 195)"
                    } else{
                        btn.style.backgroundColor = "#ffc3c3"
                    }
                    btn.style.color = "#686868"
                    btn.style.pointerEvents = "none"
                });
            };

            button.disabled = false; //Resetting clicking property of button after click
        });

        console.log("Your Current Index is:", currentIndex);
        
        // ye gandi bakchodi kar rakhi thi yaha 🥲
        // ye code else me jana tha
        // if (currentIndex === quizData.results.length) {
        //     p.style.display = "block";
        //     p.innerText = "Game Over!";
        //     p.style.color = "red"
        //     p2.style.display = "block";
        //     p2.innerText = `Your total score is ${score}`;
        //     // this code is not needed anymore since we're using start button as try again button
        //     // screen.innerText = " Question will be posted here";

        //     // nextBtn.disabled = true;
        //     // Disabling button after click
        //     // buttons.forEach((btn, i) => {
        //     //     btn.innerText = `Option ${i}`;
        //     //     btn.disabled = true;
        //     // });

        //     tryAgain();
        // }

        // checkAnswer();
    } else {
        console.log("balle balle");
        p.style.display = "block";
        p.innerText = "Game Over!";
        p.style.color = "red"
        p2.style.display = "block";
        p2.innerText = `Your total score is ${score}`;
        // this code is not needed anymore since we're using start button as try again button
        // screen.innerText = " Question will be posted here";

        // nextBtn.disabled = true;
        // Disabling button after click
        // buttons.forEach((btn, i) => {
        //     btn.innerText = `Option ${i}`;
        //     btn.disabled = true;
        // });

        tryAgain();
    }
}

async function loadData() {
    try {
        // loader for when api is loading
        loader.classList.remove("hidden");
        container.classList.add("hidden");
        quizData = await fetchApi();
        // to initially display all the data
        displayData();
        console.log(quizData.results);
        // screen.innerText=a.results[0].question
    } catch (error) {
        console.log("Error loading the data", error);
    } finally {
        // finally resetting hidden values
        loader.classList.add("hidden");
        container.classList.remove("hidden");
    }
}

// reused start button as try again button
function tryAgain() {
    // let a = document.createElement("button");
    // a.className = "try";
    // a.innerText = "Try again";
    // foot.appendChild(a);

    currentIndex = 0;
    startButton.classList.remove("hidden");
    // hiding the container when game is over, so no need to disable anything
    container.classList.add("hidden");
    startButton.innerHTML = "Try again";
    // removing styles dynamically
    bigBox.classList.remove("bigContainerAdj")
    resultArea.classList.remove("resultAreaAdj")
    // a.addEventListener("click", () => {  
    //     loadData();
    //     p.style.display = "none";
    //     p2.style.display = "none";
    //     a.style.display = "none";
    //     nextBtn.disabled = false;
    // });
}
// event listener for start button
startButton.addEventListener("click", () => {
    loadData();
    startButton.classList.add("hidden");
    bigBox.classList.add("bigContainerAdj")
    resultArea.classList.add("resultAreaAdj")
    score = 0;
    p.innerText = "";
    p2.innerText = "";
});
// placed next button outside as it doesn't have any dependency on loadData function anymore
nextBtn.addEventListener("click", () => {
    buttons.forEach((btn) => {
        btn.disabled = false;
        // khali kar denge!
        btn.style.backgroundColor = ""
        btn.style.color = ""
        btn.style.pointerEvents = ""
    });
    currentIndex++;
    displayData();
});

// in line 41 why forEach loop was not working fine but map worked fine

// after reloading data score was not getting displayed (correct and wrong answers) - didn't see it
// randomising option was in effect after completion of quiz - solved
// container should get disappeared when game gets finished only try again button should be there - solved
// Encoding issue in qusetion and options - solved
