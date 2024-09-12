import './style.css';
import { Questions } from "./questions";

const TIMEOUT = 4000;


console.log(Questions);

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");


// let i = 0;

// startButton.addEventListener("click", ()=>{

//   const question = 
//   document.querySelector("#question") ?? document.createElement('p');
//   question.id = "question";
//   question.innerText = Questions[i].question;
//   app.insertBefore(question,startButton);

// i++;
// if(i>Questions.length - 1){
//   question.remove();
//   i= 0;
// }
  
// });

startButton.addEventListener("click",startQuiz)

function startQuiz(event){
  let currentQuestion = 0;
  let score = 0;

  

  displayQuestion(currentQuestion)


  
  function clean(){
    while (app.firstElementChild){
      app.firstElementChild.remove()
    }
    const progress = getProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  


  function displayQuestion(index){
    //Delete everything that exist before
    clean();

    const question = Questions[index];

    if(!question){
      //Finish quiz
      displayFinishMessage();
      return ;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);

    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();

    submitButton.addEventListener("click", submit);

    app.appendChild(submitButton);



  }
  //Message indicating the end of quiz
  function displayFinishMessage(){
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo! Tu as fini les questions."
    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point(s) !`

    app.appendChild(h1);
    app.appendChild(p);

  }

  //function submit
  function submit(){
    const selectedAnswer = app.querySelector('input[name="answer"]:checked')

    disableAllAnswers();

    const value = selectedAnswer.value;

    const question = Questions[currentQuestion];

    const isCorrect = question.correct === value;

    if(isCorrect){
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    displayNextQuestionButton(()=>{
      currentQuestion++;
      displayQuestion(currentQuestion);
    });

    const feedback = getFeedbackMessage(isCorrect,question.correct);
    app.appendChild(feedback);

    
    //alert(`Submit ${isCorrect ? "Correct" : "Incorrect"}`);
  }

 

 

  //afficher les reponse

  function createAnswers(answers){
    const answersDiv = document.createElement("div");

    answersDiv.classList.add("answers");

    for(const answer of answers){
      const label = getAnswerElement(answer)
      answersDiv.appendChild(label);
    }

    return answersDiv;
  }
}



//afficer les questions
function getTitleElement(text){
  const title = document.createElement("h3");
  title.innerText = text;

  return title;
}

//format the id
function formatId(text){
  return text.replaceAll(" ", "-").replaceAll('"',"'").toLowerCase();

}


//afficher les reponses

function getAnswerElement(text){
  const label = document.createElement("label");
  label.innerText = text
  const input = document.createElement("input");
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type","radio");
  input.setAttribute("name","answer",);
  input.setAttribute("value",text);

  label.appendChild(input);

  return label;


}

//Submit button

function getSubmitButton(){
    const submitButton = document.createElement("button");
    submitButton.innerText = "Submit";

    return submitButton;
}


 //display a feedback
 function showFeedback(isCorrect, correct, answer){
  const correctAnswerId = formatId(correct)
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );


  // if(isCorrect){
  //   selectedElement.classList.add("correct");
  
  // }else{
  //   selectedElement.classList.add("incorrect");
  //   correctElement.classList.add("correct");
  // }

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
  

  
}

//Get feedBackMessage

function getFeedbackMessage(isCorrect, correct){
  const parapgrah = document.createElement("p");

  parapgrah.innerText = isCorrect ? "Bravo ! Tu as eu la bonne reponse."
  : `Desolee... mais la bonne reponse est: ${correct}`;

  return parapgrah;
}

//progresse bar

function getProgressBar(max, value){
  const progress = document.createElement("progress");
  progress.setAttribute("max",max)
  progress.setAttribute("value", value);
  return progress ;
}

 //Display next question button
 function displayNextQuestionButton(callback){
  let remainingTimeout = TIMEOUT;
  

  app.querySelector("button").remove();

  const getButtonText = ()=> `Next (${remainingTimeout / 1000}s)`

  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText()
  app.appendChild(nextButton);

  const interval = setInterval(()=>{
    remainingTimeout -= 1000;
  nextButton.innerText = getButtonText()

  },1000)

  const timeout = setTimeout(()=>{
    handleNextQuestion()
  },TIMEOUT);


  const handleNextQuestion = ()=>{
    
    clearInterval(interval);
    clearTimeout(timeout);
    callback();
  }

  
  nextButton.addEventListener("click", ()=>{
    handleNextQuestion();
  })

}

function disableAllAnswers(){
  const radioInputs = document.querySelectorAll('input[type="radio"]')

  for(const radio of radioInputs){
    radio.disabled = true;
  }
 } 