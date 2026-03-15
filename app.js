document.getElementById("askBtn").addEventListener("click", ask);

async function ask(){

const apiKey = document.getElementById("apikey").value;
const question = document.getElementById("question").value;

if(!apiKey){
alert("API key required");
return;
}

const answerBox = document.getElementById("answer");
const reasoningBox = document.getElementById("reasoning");

answerBox.textContent="Loading...";
reasoningBox.textContent="";

const response = await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",

headers:{
"Authorization":`Bearer ${apiKey}`,
"Content-Type":"application/json"
},

body:JSON.stringify({

model:"nvidia/nemotron-nano-12b-v2-vl:free",

messages:[
{
role:"user",
content:question
}
],

extra_body:{
include_reasoning:true
}

})

});

const data = await response.json();

if(!data.choices){
answerBox.textContent="API error";
return;
}

const msg = data.choices[0].message;

answerBox.textContent = msg.content || "";
reasoningBox.textContent = msg.reasoning || "No reasoning";

}
