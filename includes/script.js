let typeSelectId = document.getElementById("mainArea");
let mainArea = document.querySelector(".mainArea");
let questions = [];
let questionCount=10;
let catagory=18;
let correctCount=0;
let questionCounter = 0;
let totalScore=0;
let oneScore=5;
let init=true;

// Initialize the timer values
let minutes = questionCount; // set your initial minute value here,one minute per question
let seconds = 0;
let timerInterval;

$(document).ready(function(){


    mainScreen();
    $('#logo').on('click',mainScreen);

})

function mainScreen(){

    if(init==false){
        if(!confirm("Do you want to quit current game?"))
         return;
    }

    $('.buttonArea').html('');

    $('.questionbody').html('Test your computer knowledge!');
    $('.mainArea').html( 
        `<p class='main-button-container'><a class='btn btn-info btn-lg btn-block w-75 start-button' href='#' role='button'>Start Quiz</a></p>
        <p class='main-button-container'><a class='btn btn-info btn-lg btn-block w-75 level-button' href='#' role='button'>Level</a></p>
        <p class='main-button-container'><a class='btn btn-info btn-lg btn-block w-75 rank-button' href='#' role='button'>Rank</a></p>
        <p class='main-button-container'><a class='btn btn-info btn-lg btn-block w-75 about-button' href='#' role='button'>About</a></p>`
    );
    $('#questionNumber').html(`${questionCounter}/${questionCount}`);
    questionCounter=0;
    amountScore=0;
    correctCount=0;
    minutes=questionCount;
    seconds=0;
    clearInterval(timerInterval);
    document.querySelector(".start-button").addEventListener('click',answerQuiz);
    document.querySelector(".level-button").addEventListener('click',showlevel);
    document.querySelector(".rank-button").addEventListener('click',showrank);
    document.querySelector(".about-button").addEventListener('click',showabout);
}


// Function to update the timer every second
function updateTimer() {
    // Decrease seconds
    seconds--;
    
    // If seconds go below 0, decrease minutes and reset seconds to 59
    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }
    
    // Display the updated timer
    $('#timeRemain').text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    
    // If timer reaches 0:00, stop the interval
    if (minutes === 0 && seconds === 0) {
        clearInterval(timerInterval);
    }
}

async function answerQuiz(){
    clearInterval(timerInterval);
    await getQuizGroup();
    timerInterval = setInterval(updateTimer, 1000);
    $('#timeRemain').text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    $('.buttonArea').html(`<a class='btn btn-primary btn-lg btn-block w-25 next-button' href='#' role='button'>Next</a>`);
    document.querySelector(".next-button").addEventListener('click',nextQuestion);  
    getQuestion(questionCounter);
   
}

async function getQuizGroup(){
    const response = await fetch(`https://opentdb.com/api.php?amount=${questionCount}&category=${catagory}`);
    const jsondataGroup = await response.json();
    for(i=0;i<questionCount;i++){
        questions.push([
            jsondataGroup.results[i].type,
            jsondataGroup.results[i].question,
            jsondataGroup.results[i].difficulty,
            jsondataGroup.results[i].correct_answer,
            jsondataGroup.results[i].incorrect_answers[0],
            jsondataGroup.results[i].incorrect_answers[1],
            jsondataGroup.results[i].incorrect_answers[2]]);
    }
    console.log(questions);
}

function nextQuestion(){
    if(init==true){
        init=false;
    }
    getQuestion();
}

function getQuestion(){

    console.log(questions.length);
    console.log(questionCounter);
    console.log(questions[questionCounter]);

    if(questionCounter==questionCount){
        completeQuestion();
        return;
    }
    let q = questions[questionCounter][1];

    let answers=questions[questionCounter].slice(3);
    
 
    console.log(answers);
    mainArea.innerHTML="";
    $('.questionbody').html(`${questionCounter+1}. ${questions[questionCounter][1]}`);
    if(questions[questionCounter][0] == "multiple"){
        const correctNumber = Math.floor(Math.random() * 4);
        moveItem(answers,0,correctNumber);
        console.log(correctNumber);
        console.log(answers);
        for(let i=0;i<=3;i++){
            mainArea.innerHTML += ` <label><input type="radio" name="answer1" value="${i}">  ${i+1}. ${answers[i]}</label><br>`;
        }
  /*      mainArea.innerHTML = `
  //          <label><input type="radio" name="answer1" value="false">  a. ${questions[questionCounter][3]}</label><br>
  //          <label><input type="radio" name="answer1" value="false">  b. ${questions[questionCounter][4]}</label><br>
  //          <label><input type="radio" name="answer1" value="true">  c. ${questions[questionCounter][5]}</label><br>
  //          <label><input type="radio" name="answer1" value="false">  d. ${questions[questionCounter][6]}</label><br>`;
  */          
    }else{
        const correctNumber = Math.floor(Math.random() * 2);

        for(let i=0;i<=1;i++){
            let question="";
            if(i==correctNumber){
                question = answers[0];
            }else{
                question = answers[1];
            }
            mainArea.innerHTML += ` <label><input type="radio" name="answer1" value="${i}">  ${i+1}. ${question}</label><br>`;
        }
/*
        mainArea.innerHTML = `
            <label><input type="radio" name="answer1" value="false">a. True</label><br>
            <label><input type="radio" name="answer1" value="true"> b. False</label><br>`;
*/
    }

    $('#questionNumber').html(`${questionCounter+1}/${questionCount}`);

    if(init != true){
        console.log($(`input[name='answer1']:checked`).length);
        if($(`input[name='answer']:checked`).length === 0){
   //         alert("At least one option.");
  //          return;
        }

        questionCounter++;
        if(questionCounter==questionCount){
            $('.next-button').text('Submit');
        }
        console.log(questionCounter);
    }

}

function moveItem(array, fromIndex, toIndex) {
    // Check if indexes are within the array bounds
    if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
        console.error('Index out of bounds');
        return;
    }

    // Remove the item from the 'fromIndex'
    const [item] = array.splice(fromIndex, 1);

    // Insert the item at the 'toIndex'
    array.splice(toIndex, 0, item);
}

ResumeMain = ()=>{
    $('.buttonArea').html(`<a class='btn btn-primary btn-lg btn-block w-75 resume-button' href='#' role='button'>resume</a>`);
    $('.resume-button').on('click',mainScreen);  
}

gameOver =()=>{
    $('.questionbody').html('Game Over');
    $('.questionbody').css('color','red');
    $('.mainArea').html(`time out`);
    ResumeMain(); 
}

completeQuestion = () => {
    mainArea.innerHTML='';
    $('.questionbody').html('Game Completed');
    $('.mainArea').html(`Congratulations,you completed the game<br>
                        Your got score: <br>
                        Your level now is: <br>
                        Your rank on the world is:`);
    init==true
    ResumeMain(); 
}

showlevel = () => {
    $('.questionbody').html('Your Level');
    $('.mainArea').html(`Your level is: <br>
                        you score is:<br> 
                        your need more 100 to get next level<br>
                        Go<br>
                        
                        score/Level rules:`);
    ResumeMain(); 
}

showrank = () => {
    $('.questionbody').html('Your Rank');
    $('.mainArea').html(`Your rank is: 20/12329 <br>
                        top 100:<br>
                        ------<br>
                        ------`);
    ResumeMain(); 
}  

showabout = () => {
    mainArea.innerHTML='';
    $('.questionbody').html('About Trivia Game');
    $('.mainArea').html(`This is a simple trivia game to test your Knowledge about computer science<br>
        Answer 20 questions as quickly and as accurately as possible in each themed game<br>
        Your score and rank will be displayed on completion of the game<br>
        Questions are updated every time when you replay the game.`);
    ResumeMain(); 
}
