let screen = document.querySelector(".screen")
let buttons = document.querySelectorAll(".btn")
let foot=document.querySelector(".foot");
let p= document.querySelector(".p")
let p2= document.querySelector(".p2")

let currentIndex = 0;
let score=0;
let quizData

let nextBtn = document.querySelector(".next");

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
        
let currentIndex = 0;
       
        nextBtn.addEventListener('click', () => {
            if (currentIndex < quizData.results.length) {
                let buttonsArr = []   
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
                          
                            p.innerText=`Correct Answer now your score is ${score}`
                         
                           
                        }
                        else
                        {
                            console.log("Wrong Answer")
                            p.innerText="Wrong Answer"
                        }

                            //Disabling button after click
                        buttons.forEach((btn)=>
                            {
                                btn.disabled=true;
                            })
                       
                    }

                    button.disabled=false;  //Resetting clicking property of button after click

                  

                   
                })


                currentIndex++;
                console.log('Your Current Index is:',currentIndex);
                if(currentIndex === quizData.results.length)
                {   p.style.display='block'
                    p.innerText='Game Over!'
                    p2.style.display='block'
                    p2.innerText=`Your total score is ${score}`
                    screen.innerText=' Question will be posted here'

                    nextBtn.disabled=true;
                        //Disabling button after click
                        buttons.forEach((btn,i)=>
                            {
                                btn.innerText=`Option ${i}`
                                btn.disabled=true;
                            })

                    tryAgain();
                }
                
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

function tryAgain()
{
    let a=document.createElement("button")
    a.className='try'
    a.innerText='Try again'
    foot.appendChild(a)

    currentIndex=0;
   a.addEventListener('click',()=>
{
    loadData()
    p.style.display='none'
    p2.style.display='none'
    a.style.display='none'
    nextBtn.disabled=false;



    
})
}

loadData()





// in line 41 why forEach loop was not working fine but map worked fine

// after reloading data score was not getting displayed (correct and wrong answers)
// randomising option was in effect after completion of quiz
// container should get disappeared when game gets finished only try again button should be there
// Encoding issue in qusetion and options 

