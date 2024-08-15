let typeSelectId = document.getElementById("mainArea");
let mainArea = document.querySelector(".mainArea");
let questions = [];
let userInformation=[];
let questionCount=10;
let category={"value":18,"text":"Computer"};
let level="easy";
let correctCount=0;
let questionCounter = 0;
let totalScore=0;
let oneScore=5;
let musicFlag=false;
let init=true;
let userName="";
let userPassword="";
let remoteScore=0;
let remoteRank=0;

// Initialize the timer values
let minutes = questionCount; // set your initial minute value here,one minute per question
let seconds = 0;
let timerInterval;

const jsonDataCategory = [
    { "value": "18", "text": "Computer" },
    { "value": "19", "text": "Mathematics" },
    { "value": "21", "text": "Music" },
    { "value": "15", "text": "Video Game" },
    { "value": "11", "text": "Film" },
    { "value": "10", "text": "Sports" },
    { "value": "23", "text": "History" }
];

$(document).ready(function(){

    mainScreen();
    $('#logo').on('click',mainScreen);
    $('#musicSetting').on('click',musicSetting);
    getUserInformation();

})

function mainScreen(){

    if(init==false){
  //      if(!confirm("Do you want to quit current game?"))
 //        return;
    }

    let musiccolor = musicFlag ? "white" : "gray";
    $('#backmusic').css('color',musiccolor);

    $('.buttonArea').html('');

    $('.questionbody').html(`Test your ${category.text} knowledge!`);
    $('.mainArea').html( 
        `<div class='main-button-container'><i class="bi bi-brilliance fs-2 startstar" style="color: blue;"></i>
            <a class='btn btn-primary btn-lg btn-block w-75 start-button mb-3' href='#' role='button'>Start Quiz</a>
            <i class="bi bi-brilliance fs-2 startstar" style="color: blue;"></i></div>
        <div class='main-button-container'><i class="bi bi-brilliance fs-2 levelstar" style="color: blue;"></i>
            <a class='btn btn-primary btn-lg btn-block w-75 level-button my-3' href='#' role='button'>Level & category</a>
            <i class="bi bi-brilliance fs-2 levelstar" style="color: blue;"></i></div>
        <div class='main-button-container'><i class="bi bi-brilliance fs-2 rankstar" style="color: blue;"></i>
            <a class='btn btn-primary btn-lg btn-block w-75 rank-button my-3' href='#' role='button'>Rank</a>
            <i class="bi bi-brilliance fs-2 rankstar" style="color: blue;"></i></div>
        <div class='main-button-container'><i class="bi bi-brilliance fs-2 aboutstar" style="color: blue;"></i>
        <a class='btn btn-primary btn-lg btn-block w-75 about-button my-3' href='#' role='button'>About</a>
        <i class="bi bi-brilliance fs-2 aboutstar" style="color: blue;"></i></div>`
    );
    $('#questionNumber').html(`${questionCounter}/${questionCount}`);
    $('#level').html(`Level: ${level}`);
    $('#category').html(`Category: ${category.text}`);
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
    $('.startstar').hide();
    $('.start-button').on('mouseenter',function(){
        $('.startstar').show();
    });
    $('.start-button').on('mouseleave',function(){
        $('.startstar').hide();
    });
    $('.levelstar').hide();
    $('.level-button').on('mouseenter',function(){
        $('.levelstar').show();
    });
    $('.level-button').on('mouseleave',function(){
        $('.levelstar').hide();
    });
    $('.rankstar').hide();
    $('.rank-button').on('mouseenter',function(){
        $('.rankstar').show();
    });
    $('.rank-button').on('mouseleave',function(){
        $('.rankstar').hide();
    });
    $('.aboutstar').hide();
    $('.about-button').on('mouseenter',function(){
        $('.aboutstar').show();
    });
    $('.about-button').on('mouseleave',function(){
        $('.aboutstar').hide();
    });
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
        console.log("Time out");
        gameOver();
    }
}

async function answerQuiz(){
    clearInterval(timerInterval);
    await getQuizGroup();
    timerInterval = setInterval(updateTimer, 1000);
    $('#timeRemain').text(minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
    if(musicFlag){
        $('#background-music')[0].play();
    }   

    //$('.buttonArea').html(`<a class='btn btn-primary btn-lg btn-block w-25 next-button' href='#' role='button'>Next</a>`);
    //document.querySelector(".next-button").addEventListener('click',nextQuestion);  
    getQuestion(questionCounter);
   
}

async function getUserInformation(){
   // try{
        const response = await fetch(`https://0cc46425-3d05-4041-afae-d327b334c4d9-00-36cyfuv0pxayf.spock.replit.dev/data`
            //,{  mode: 'no-cors' }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsondataGroup = await response.json();

        console.log(jsondataGroup.length);
        for(i=0;i<jsondataGroup.length;i++){
            userInformation.push([
                jsondataGroup[i].name,
                jsondataGroup[i].password,
                jsondataGroup[i].score
            ]);
        }
        console.log(userInformation);
   // }catch(error){
   //     console.log(error);
   // }
}


async function getQuizGroup(){
    const response = await fetch(`https://opentdb.com/api.php?amount=${questionCount}&category=${category.value}&difficulty=${level}`);
    const jsondataGroup = await response.json();
    for(i=0;i<questionCount;i++){
        questions.push([
            jsondataGroup.results[i].type,
            jsondataGroup.results[i].question,
            jsondataGroup.results[i].difficulty,
            jsondataGroup.results[i].correct_answer,
            jsondataGroup.results[i].incorrect_answers[0],
            jsondataGroup.results[i].incorrect_answers[1],
            jsondataGroup.results[i].incorrect_answers[2],
            jsondataGroup.results[i].difficulty,
            jsondataGroup.results[i].category
        ]);
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
    let correctNumber = 0;
    
 
    console.log(answers);
    mainArea.innerHTML="";
    $('.questionbody').html(`${questionCounter+1}. ${questions[questionCounter][1]}`);
    if(questions[questionCounter][0] == "multiple"){
        correctNumber = Math.floor(Math.random() * 4);
        moveItem(answers,0,correctNumber);
        console.log(correctNumber);
        console.log(answers);
        for(let i=0;i<=3;i++){
            mainArea.innerHTML += ` </i><label class="question-back${i} bg-dark text-white p-2 w-75 m-1 rounded-pill text-start"><input class="fs-2" type="radio" name="answer1" value="${i}">  ${i+1}. ${answers[i]}</label><br>`;

        }
    }else{
        correctNumber = Math.floor(Math.random() * 2);

        for(let i=0;i<=1;i++){
            let question="";
            if(i==correctNumber){
                question = answers[0];
            }else{
                question = answers[1];
            }
            mainArea.innerHTML += ` <label class="question-back${i} bg-dark text-white p-2 w-75 m-1 rounded-pill text-start"><input type="radio" name="answer1" value="${i}">  ${i+1}. ${question}</label><br>`;
        }

    }
    $('.question-back0').on('mouseenter',function(){
        console.log("enter");
        $(this).css('background-color','blue');
    });
    $('.question-back0').on('mouseleave',function(){
        console.log("leave");
        $(this).css('background-color','black');
    });


    $('#questionNumber').html(`${questionCounter+1}/${questionCount}`);
    mainArea.innerHTML += `<p id='noticetext'><p>`;
    mainArea.innerHTML +=`<a id='getValue' class='btn btn-primary btn-lg btn-block w-25 next-button mt-5' href='#' role='button'>Next</a>`
    //<button type="button" id="getValue">Get Checked Value</button>`;

    $('#getValue').on('click',function(){

        if($(`input[name='answer1']:checked`).length === 0){
            console.log("return");
            $('#noticetext').text('Please select one answer at least!');
            $('#noticetext').css('color','red');
            return;
        }

        let checkedValue = $(`input[name="answer1"]:checked`).val();
        console.log("correctNumber:"+correctNumber);
        if(checkedValue == correctNumber){
            correctCount++;
        }

        questionCounter++;
        if(questionCounter==questionCount){
            //$('.next-button').text('Submit');
            $('#getValue').text('Submit');

        }
        console.log(questionCounter);

        console.log("correctCount:"+correctCount);
        nextQuestion();    
    });

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
    $('.buttonArea').html(`<a class='btn btn-primary btn-lg btn-block w-25 resume-button' href='#' role='button'>resume</a>`);
    $('.resume-button').on('click',mainScreen);  
}

gameOver =()=>{
    $('.questionbody').html('Time Out');
    $('.questionbody').css('color','red');  
    $('.mainArea').html('Game Over');
    ResumeMain(); 
}

completeQuestion = () => {
    correctCount
    mainArea.innerHTML='';
    $('.questionbody').html('Game Completed');
    $('.mainArea').html(`Congratulations, you completed the game<br>
                        Your got score: ${correctCount*oneScore}(${correctCount}/${questionCount})<br>
                    `);
    init==true
    ResumeMain(); 
}

showlevel = () => {
    $('.questionbody').html('Question Level&category');
    $('.mainArea').html(`
        <div class='input-group mb-3'>
            <label for="categorycheck">Select question category:---</label>
            <select id="categorycheck" class="form-select form-select-sm" aria-label="">
                <option selected>${category.text}</option>
                <option value="18">Computer</option>
                <option value="19">Mathematics</option>
                <option value="21">Music</option>
                <option value="15">Video Game</option>
                <option value="11">Film</option>
                <option value="10">Sports</option>
                <option value="23">History</option>
            </select>
        </div>
        <div class='input-group mb-3'>
            <label for="levels">Select question Level:-------</label>
            <select id="levels" class="form-select form-select-sm" aria-label="">
                <option selected>${level}</option>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
            </select>
        </div>
        <div class="input-group">
            <label class="form-check-label" for="questionsperround">
                questions per round:---
            </label>
            <input class="form-control" type="text" value=${questionCount} id="questionsperround">
        </div>  
    `);

    $('#levels').on('change',function(){        
        level = $('#levels').val();    
        console.log("Levels:"+level);
    });
    $('#categorycheck').on('change',function(){
        category.value = $('#categorycheck').val();
        category.text = $('#categorycheck option:selected').text();
        console.log("category:"+category.text+" value:"+category.value);
    });

    $('#questionsperround').on('change',function(){
        questionCount = $('#questionsperround').val();
        console.log("questionCount:"+questionCount);
    });
    ResumeMain(); 
}

//display the aler message for all function of validation.
function alertMessage(message){
    let alert = document.getElementById('alertModal');
    alert.innerHTML = message;
    alert.style.color = 'red';

}

function validateName(name) {
    //cannot be blank, nor intergers or symbols, and can not have a space in the name fields
    const nameRegex = /^[A-Za-z]+$/;
    if (nameRegex.test(name)) {
        return true;
    } else {
        return false;
    }
}

submission=()=>{

    //clear the alert message when loading modal
    alertMessage(' ');
    //Use Regex to validate the form
    firstname = document.getElementById('input-firstname').value;
    if(!validateName(firstname)){
        alertMessage('First Name cannot be blank, nor intergers or symbols, and can not have a space in the name fields');
        return;
    }
    password = document.getElementById('input-password').value;

    for(i=0;i<userInformation.length;i++){
        if(userInformation[i][0]==firstname && userInformation[i][1]==password){
            userName = firstname;
            userPassword = password;
            remoteScore = userInformation[i][2];
            remoteRank = i+1;
            break;
        }
    }

    if(userName=="" ){
        alertMessage('UserName or Password is incorrect');
        return;
    }
       
    //clear alert message when validate successful.
    alertMessage(' ');
    
    //hide the modal with jquire. do no get better way with DOM for now.
    $('#userModal').modal('hide');
    loginflag=1;
   

    //hide login and show logout
    document.querySelector('#login').style.display = "none";
    logout.classList.remove('btn-light');
    logout.classList.add('btn-danger');
    logout.textContent = "Logout";
    //logout.style.display = "block";
    $('#profile').html (`<br>
        user name: ${userName}<br>
        score: ${remoteScore}<br>
        Your rank is:${remoteRank}/${userInformation.length} <br>`)
    //show user profile
    //displayprofile();
}

showrank = () => {
/*    $('.questionbody').html('Your Rank');
    $('.mainArea').html(`Your rank is: 20/12329 <br>
                        top 100:<br>
                        ------<br>
                        ------`);
                        */
    $('.questionbody').html('Your Rank');
    
    $('.mainArea').html(`
                        <button id="login" type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#userModal">Login</button>
                        <button id="logout" type="button" class="btn btn-light"></button> 
                        <p id="profile"></p>
                        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel">Login</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div>
                                            <div class="input-group">
                                                <span class="input-group-text  fs-2 text-primary-emphasis" id="icon-firstname">
                                                    <i class="bi bi-person-fill"></i>
                                                </span>
                                                <input id = "input-firstname" type="text" class="form-control" placeholder="FirstName" aria-label="Input group" aria-describedby="icon-firstname">
                                            </div>
                                            <div class="input-group">
                                                <span class="input-group-text fs-2 text-primary-emphasis" id="icon-lastname">
                                                    <i class="bi bi-person-fill"></i>
                                                </span>
                                                <input id = "input-password" type="text" class="form-control" placeholder="LastName" aria-label="Input group" aria-describedby="icon-lastname">
                                            </div>
                                            
                                            <!--if there are invalid input. will not users here.-->
                                            <h5 id="alertModal"></h3>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Close</button>
                                        <button id = "button-submission" type="button" class="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `);                   
    $('#button-submission').on('click',submission);
    $('#logout').on('click',function(){
        $('#profile').html('');
        $('#login').show();
        $('#logout').hide();
    });
    ResumeMain(); 
}  

systemSetting = () => {

    let checkstatus = musicFlag ? "checked" : "";

    $('.questionbody').html('System Setting');
    $('.mainArea').html(`
        <div class="input-group"> 
            <label class="form-check-label" for="musicCheck">
                Background Music:-----
            </label>
            <input class="form-check-input" type="checkbox" value="" id="musicCheck" ${checkstatus}>
        </div>
        <div class="input-group">
            <label class="form-check-label" for="questionsperround">
                questions per round:---
            </label>
            <input class="form-control" type="text" value=${questionCount} id="questionsperround">
        </div>`);  
    $('#musicCheck').on('change',function(){
        musicFlag = $('#musicCheck').prop('checked');
        console.log("musicFlag:"+musicFlag);
    });

    $('#questionsperround').on('change',function(){
        questionCount = $('#questionsperround').val();
        console.log("questionCount:"+questionCount);
    });

    ResumeMain(); 
}  

musicSetting = () => {

    if(musicFlag){
        $('#background-music')[0].pause();
        $('#backmusic').css('color','gray');
        musicFlag = false;
    }else{
        $('#background-music')[0].play();
        $('#backmusic').css('color','white');
        musicFlag = true;
    }
}

showabout = () => {
    mainArea.innerHTML='';
    $('.questionbody').html('About Trivia Game');
    $('.mainArea').html(`This is a simple trivia game to test your Knowledge about computer science<br>
        Answer 20 questions as quickly and as accurately as possible in each themed game<br>
        Your score and rank will be displayed on completion of the game<br>
        Questions are updated every time when you replay the game.`);
    $('.mailArea').css('background-image','../images/king-1846807_1280.jpg');
    ResumeMain(); 
}
