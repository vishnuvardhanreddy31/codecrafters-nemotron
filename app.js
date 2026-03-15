const chat = document.getElementById("chat")

const promptBox = document.getElementById("prompt")

const sendBtn = document.getElementById("send")

const modelSelect = document.getElementById("model")

const clearBtn = document.getElementById("clear")

const settingsBtn = document.getElementById("settingsBtn")

const settings = document.getElementById("settings")

const keyInput = document.getElementById("apikey")

const saveKey = document.getElementById("saveKey")

let apiKey = localStorage.getItem("openrouter_key")

let history = JSON.parse(localStorage.getItem("chat_history") || "[]")

if(apiKey) keyInput.value = apiKey


settingsBtn.onclick=()=>{
settings.classList.toggle("hidden")
}

saveKey.onclick=()=>{
apiKey = keyInput.value
localStorage.setItem("openrouter_key",apiKey)
settings.classList.add("hidden")
}

clearBtn.onclick=()=>{
history=[]
localStorage.removeItem("chat_history")
chat.innerHTML=""
}


function renderMessage(role,text,reasoning){

const msg=document.createElement("div")

msg.className="message "+role

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


history.forEach(m=>{
renderMessage(m.role,m.content,m.reasoning)
})


sendBtn.onclick=send


async function send(){

const question=promptBox.value.trim()

if(!question)return

promptBox.value=""

renderMessage("user",question)

history.push({
role:"user",
content:question
})

const loading=document.createElement("div")

loading.className="message ai"

loading.innerText="Thinking..."

chat.appendChild(loading)

const response=await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
method:"POST",
headers:{
Authorization:"Bearer "+apiKey,
"Content-Type":"application/json"
},

body:JSON.stringify({

model:modelSelect.value,

messages:history,

extra_body:{
include_reasoning:true
}

})

})

const data=await response.json()

loading.remove()

if(!data.choices){

renderMessage("ai","API error")

return
}

const msg=data.choices[0].message

renderMessage("ai",msg.content,msg.reasoning)

history.push({
role:"assistant",
content:msg.content,
reasoning:msg.reasoning
})

localStorage.setItem("chat_history",JSON.stringify(history))

}