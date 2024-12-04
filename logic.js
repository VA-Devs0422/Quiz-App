let screen = document.querySelector(".screen")
let buttons = document.querySelectorAll(".btn")
let currentIndex = 0;
let score=0;
let quizData

// console.log(screen)

function fetchApi() {
    let a = 'https://opentdb.com/api.php?amount=10&type=multiple'
    return fetch(a)
        .then(response => {
            if (!response.ok) {
                console.error(`Error: ${response.statusText}`)
            }
            return response.json()
        }).then(data => {
            console.log(data)
            return data;
        }
        ).catch(error => {
            console.error('Failed to fetch API ', error)
            throw error
        }
        )

}

async function loadData() {
    try {
        let quizData = await fetchApi();
        let nextBtn = document.querySelector(".next");
       
        nextBtn.addEventListener('click', () => {
            if (currentIndex < quizData.results.length) {
                let buttonsArr = []      // Creating an array of options
                screen.innerText = quizData.results[currentIndex].question     //Logic to push the current question text into the screen
                buttonsArr.push(quizData.results[currentIndex].correct_answer)  // pushing options to the array of buttons i.e correct answer

                /*Pushing the remaining incorrect options to array of buttons*/ 
                    quizData.results[currentIndex].incorrect_answers.map((ans) => {
                    buttonsArr.push(ans)
                })
                
                buttonsArr = buttonsArr.sort(() => Math.random() - 0.5)    //Randomising the options in the buttons array


                /* Loop statement to assign elements of array of buttons into the buttons of options and check the correct answer*/
                buttons.forEach((button, i)=>{
                    button.innerText = buttonsArr[i]

                    button.onclick=()=>
                    {      console.log("Button text:", button.innerText);
                        console.log("Decoded Correct Answer:", quizData.results[currentIndex-1].correct_answer);
                        if (button.innerText === quizData.results[currentIndex-1].correct_answer)
                        {
                            score++;
                            console.log("Correct! Score:", score);
                        }
                        else
                        {
                            console.log("Wrong Answer")
                        }
                     
                    }

                   
                })


                currentIndex++;
                console.log('Your Current Index is:',currentIndex);
                // checkAnswer();
            } 
            
            else{
                console.log("balle balle");
            }
        })
        console.log(quizData.results)
        // screen.innerText=a.results[0].question

    }

    catch (error) {
        console.log('Error loading the data', error)
    }


}

loadData()


// function checkAnswer()
// {      
//         buttons.forEach((button)=>
//         {
//             button.addEventListener('click',()=>
//                 {
//                     if(button.innerText === quizData.results[currentIndex-1].correct_answer)
//                     {
//                             score++;
                           
            
//                     }
//                     else{
//                         console.log('Wrong answer')
//                     }
//                     console.log(score)
                   
//                 })
//         })
    
// }



// in line 41 why forEach loop was not working fine but map worked fine

