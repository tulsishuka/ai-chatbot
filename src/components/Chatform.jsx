import { useRef } from "react"

const Chatform = ({setchatHistory, generateBotResponse,chatHistory}) => {
const inputRef = useRef()

const handleFormSubmit = (e)=>{
 e.preventDefault()
 const userMessage = inputRef.current.value.trim();
 if (!userMessage) return;
 inputRef.current.value = "";

//  update history with user message
setchatHistory((history)=>[...history, {role:"user", text:userMessage}])


setTimeout(() =>{
   setchatHistory((history) => [...history,{role:"model", text:"Thinking..."}])
  
// call the fun to generatte the bot respnse
generateBotResponse([...chatHistory,{role:"user", text:`Using the detail provided above, please adress this query:${userMessage}`}]);
},600)

}


  return (
      <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
            <input ref={inputRef} type='text' placeholder='Message....' required className='message-input'/>
<button className="material-symbols-outlined">arrow_upward</button>

          </form>
  )
}

export default Chatform