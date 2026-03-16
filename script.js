let questions = [];
let current = 0;
let score = 0;

let totalPoints = 1000;
let passingScore = 700;
let points = 0;

let pointsPerQuestion;
let questionResults = [];

fetch("questions3.json")
.then(res => res.json())
.then(data => {

questions = data;

pointsPerQuestion = Math.floor(totalPoints / questions.length);

questionResults = new Array(questions.length).fill(null);

createStatusBoxes();

loadQuestion();

});

function createStatusBoxes(){

let container = document.getElementById("questionStatus");

for(let i=0;i<questions.length;i++){

let box = document.createElement("div");
box.className="statusBox";
box.id="status-"+i;

container.appendChild(box);

}

}

function loadQuestion(){

let q = questions[current];

document.getElementById("question-number").innerText =
`Question ${current+1} of ${questions.length}`;

document.getElementById("question").innerText = q.question;

document.getElementById("code").innerText = q.code || "";

let progress = (current / questions.length) * 100;
document.getElementById("progress").style.width = progress + "%";

let shuffled = q.options.map((opt,i)=>({
text: opt,
originalIndex: i
}));

shuffled.sort(()=>Math.random()-0.5);

let answers="";

shuffled.forEach(opt=>{

answers += `
<div class="option"
data-original="${opt.originalIndex}"
onclick="checkAnswer(this)">
${opt.text}
</div>`;

});

document.getElementById("answers").innerHTML = answers;

document.getElementById("feedback").innerHTML="";
}

function checkAnswer(el){

let q = questions[current];

let options = document.querySelectorAll(".option");

options.forEach(o=>o.style.pointerEvents="none");

let chosen = el.dataset.original;

if(Number(chosen) === q.correct_index){

el.classList.add("correct");

questionResults[current]="correct";

document.getElementById("status-"+current)
.classList.add("correct");

points += pointsPerQuestion;
score++;

}else{

el.classList.add("wrong");

questionResults[current]="wrong";

document.getElementById("status-"+current)
.classList.add("wrong");

options.forEach(opt=>{
if(Number(opt.dataset.original) === q.correct_index){
opt.classList.add("correct");
}
});

}

document.getElementById("points").innerText = points;

}

function nextQuestion(){

current++;

if(current >= questions.length){

let percent = Math.round((points / totalPoints) * 100);

let passed = points >= passingScore ? "PASSED" : "FAILED";

document.getElementById("quiz").innerHTML = `

<h2>Exam Finished</h2>

<p><strong>Score:</strong> ${points} / ${totalPoints}</p>

<p><strong>Percentage:</strong> ${percent}%</p>

<h2>Status: ${passed}</h2>

<p>Correct Answers: ${score} / ${questions.length}</p>

`;

return;

}

loadQuestion();

}

function prevQuestion(){

if(current>0){

current--;

loadQuestion();

}

}

function goToQuestion(){

let num = document.getElementById("searchQuestion").value;

if(num>=1 && num<=questions.length){

current = num-1;

loadQuestion();

}

}
