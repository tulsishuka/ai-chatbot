
import './App.css'
  import ChatbotIcon from './components/ChatbotIcon'
 import Chatform from './components/Chatform'
import ChatMessage from './components/ChatMessage';
import { useRef, useState ,useEffect} from 'react';
import { companyInfo } from './components/companyInfo';
function App() {
  const [chatHistory, setchatHistory] = useState([{
    role:"model",
    text:companyInfo,
    hideInChat:true,
  }]);
  const chatBodyRef = useRef();
  const [showChatbot, setshowChatbot] = useState(false)

  const generateBotResponse =async (history)=>{
// helper function to update chat history
    const updateHistory = (text, isError = false)=>{
      setchatHistory(prev => [...prev.filter(msg =>msg.text !== "Thinking..."),{role:"model", text, isError}])
    }

    // format chat history for api request
history = history.map(({role,text})=>({role,parts:[{text}]}))

  const requestOptions = {
   method:"POST",
   headers:{"Content-Type": "application/json"},
   body:JSON.stringify({contents:  history})
  }
try {
  // Make the api call to get the bot response
  const response = await fetch(import.meta.env.VITE_API_URL,requestOptions);
  const data = await response.json();
  if (!response.ok) 
    throw new Error(data.error.message || "something went wrogn");

  // clean and update history chat with bot response

       const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
       updateHistory(apiResponseText);

  
} catch (error) {
  console.log(error.message,true)
}
  }
useEffect(()=>{
  // auto-scroll whenver chat history updates
  chatBodyRef.current.scrollTo({top:chatBodyRef.current.scrollHeight,behavior:"smooth"});
},[chatHistory]);

  
  return (
    <>
    
      <div className={`container  ${showChatbot ? 'show-chatbot': ''}`}>
       <button id='chatbot-toggler' onClick={()=> setshowChatbot((prev) =>!prev)}>
<span className="material-symbols-outlined">mode_comment</span>
<span className="material-symbols-outlined">close</span>

       </button>
      <div className="chatbot-popup">
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon/>
            <h2 className='logo-text'>Chatbot</h2>
          </div>
         
<button onClick={()=> setshowChatbot((prev) =>!prev)} className="material-symbols-outlined">keyboard_arrow_down</button>
        </div>
        {/* chatbot body */}
        <div  ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
              <ChatbotIcon/>
              <p className='message-text' >
                Hey there <br/>How  can i help you today</p>
          </div>
          {/* render dynamic history */}
          {chatHistory.map((chat,index) => (
<ChatMessage key={index} chat={chat}/>
          ))}
        
        </div>
        {/* CHATBOT FOOTER */}
        <div className="chat-footer">
         <Chatform chatHistory={chatHistory} setchatHistory={setchatHistory} generateBotResponse={generateBotResponse}/>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
