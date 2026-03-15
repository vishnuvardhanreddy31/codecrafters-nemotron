const chat = document.getElementById("chat")

const sendBtn = document.getElementById("send")

const promptBox = document.getElementById("prompt")

const settings = document.getElementById("settings")

const settingsBtn = document.getElementById("settingsBtn")

const saveKey = document.getElementById("saveKey")

const keyInput = document.getElementById("apikey")

let apiKey = localStorage.getItem("openrouter_key")

if(apiKey) keyInput.value = apiKey


settingsBtn.onclick=()=>{
settings.classList.toggle("hidden")
}

saveKey.onclick=()=>{
localStorage.setItem("openrouter_key",keyInput.value)
apiKey = keyInput.value
settings.classList.add("hidden")
}


function addMessage(text,type,reasoning){

const msg=document.createElement("div")

msg.className="message "+type

msg.innerText=text

if(reasoning){

const r=document.createElement("div")

r.className="reasoning"

r.innerText="Reasoning:\n"+reasoning

msg.appendChild(r)

}

chat.appendChild(msg)

chat.scrollTop=chat.scrollHeight

}


sendBtn.onclick=async()=>{

const question=promptBox.value

if(!question)return

addMessage(question,"user")

promptBox.value=""

const loading=document.createElement("div")

loading.className="message ai"

loading.innerText="Thinking..."

chat.appendChild(loading)

chat.scrollTop=chat.scrollHeight

const response=await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",

headers:{
"Authorization":"Bearer "+apiKey,
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

})

const data=await response.json()

loading.remove()

if(!data.choices){

addMessage("API Error","ai")

return
}

const msg=data.choices[0].message

addMessage(msg.content,"ai",msg.reasoning)

}