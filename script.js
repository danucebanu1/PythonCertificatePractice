let questions = [];
let current = 0;
let score = 0;

fetch("questions3.json")
.then(res => res.json())
.then(data => {
    questions = data;
    loadQuestion();
});

function loadQuestion(){

    let q = questions[current];

    if(current > 0){
        document.getElementById("prevBtn").style.display = "inline-block";
    }else{
        document.getElementById("prevBtn").style.display = "none";
    }

    document.getElementById("question-number").innerText =
        `Question ${current+1} of ${questions.length}`;

    document.getElementById("question").innerText = q.question;
    document.getElementById("code").innerText = q.code || "";

    // shuffle answers
    let shuffled = q.options.map((opt,i)=>({
        text: opt,
        originalIndex: i
    }));

    shuffled.sort(()=>Math.random()-0.5);

    let answers="";

    shuffled.forEach((opt,i)=>{
        answers += `
        <div class="option"
        id="opt-${i}"
        data-original="${opt.originalIndex}"
        onclick="checkAnswer(${i})">
        ${opt.text}
        </div>`;
    });

    document.getElementById("answers").innerHTML = answers;
    document.getElementById("feedback").innerHTML = "";
}

function prevQuestion(){
    if(current > 0){
        current--;
        loadQuestion();
    }
}

function nextQuestion(){

    current++;

    if(current >= questions.length){

        document.getElementById("quiz").innerHTML =
        `<h2>Quiz Finished!</h2>
        <h3>Final Score: ${score} / ${questions.length}</h3>`;

        return;
    }

    loadQuestion();
}

function checkAnswer(i){

    let q = questions[current];
    let options = document.getElementsByClassName("option");

    // disable clicking again
    for(let opt of options){
        opt.style.pointerEvents = "none";
    }

    let chosen = options[i].dataset.original;

    if(Number(chosen) === q.correct_index){

        options[i].classList.add("correct");

        document.getElementById("feedback").innerHTML =
        `<span style="color:#2ecc71">✔ Correct!</span><br>
        <p>${q.explanation || ""}</p>`;

        score++;

    }else{

        options[i].classList.add("wrong");

        // highlight correct answer
        for(let opt of options){
            if(Number(opt.dataset.original) === q.correct_index){
                opt.classList.add("correct");
            }
        }

        document.getElementById("feedback").innerHTML =
        `<span style="color:#ff4d4f">✖ Incorrect.</span><br>
        <p>${q.explanation || ""}</p>`;
    }
}

function goToQuestion(){

    let num = document.getElementById("searchQuestion").value;

    if(num >= 1 && num <= questions.length){

        current = num - 1;
        loadQuestion();

    }else{

        alert("Question not found");
    }
}
