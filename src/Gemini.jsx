import React, { useEffect, useState, useContext } from 'react';
import { messageContext } from './ConversationContext/Context.jsx';
import { GoogleGenerativeAI } from '@google/generative-ai';

const Gemini = () => {

  const [isResponseViewed, setIsResponseViewed] = useState(false)
  const [isWholeChatViwed, setIsWholeChatViwed] = useState(false)

  const [chatHistory, setChatHistory] = useState([
    {
      role: "user",
      parts: [{ text: "whatever i ask repsond within at max 500 charecters" }],
    },
    {
      role: "model",
      parts: [{ text: "ok" }],
    },
  ]);

 
  const textToSpeech = (txt) => {
    if (!txt) return;
    const newSpeech = new SpeechSynthesisUtterance(txt);
    newSpeech.rate = 1.7;
    speechSynthesis.speak(newSpeech);
    newSpeech.onend = () => {
      // setRespone('');
      startListening();
    };
  };

  const { finalQuery, setFinalQuery, response, setRespone, startListening, stopListening } = useContext(messageContext);

  const apikey = import.meta.env.VITE_API_KEY;
  const genAI = new GoogleGenerativeAI(apikey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const handleSubmit = async () => {

    if (finalQuery) {

      let updatedHistory = [...chatHistory, { role: 'user', parts: [{ text: finalQuery }] }]; 

      const chat = model.startChat({ history: updatedHistory });
      let result = await chat.sendMessage(finalQuery);

      let tempResponse = result.response.text();
      // tempResponse = tempResponse.replace(/\n+/g, '');
      tempResponse = tempResponse.replace(/[*]*/g, '');

      // console.log('for query: ', finalQuery);
      // console.log('response: ', tempResponse);
      
       updatedHistory = [...updatedHistory, { role: 'model', parts: [{ text: tempResponse }] }]; 
      setChatHistory(updatedHistory);
      setRespone(tempResponse);
      
      stopListening();
    }
  };



  const renderWholeChat = ()=>{
    
    return (
          chatHistory.map((chat,index) => {
            if(index>1 && index%2==0)
            return <div style={{display:"block", margin:"1rem"}}>
                <div key={index} style={{width:"fit-content", right : chat["role"]==="user" ? "0" : " ",color: chat["role"]==="user" ? "#000" : "#fff", fontSize:"1.5rem", textWrap:"wrap", backgroundColor: chat["role"]==="user" ? "#fff" : "#000", padding:".5rem 1rem", lineHeight:"2rem", borderRadius:".3rem"}}>
                  {chat["parts"][0].text}
                </div>
                <br />  
                <br />
              </div>
          })
    )
  }
 

  useEffect(() => {
    speechSynthesis.cancel();
    textToSpeech(response);
  }, [response]);

  useEffect(() => {
    handleSubmit();
  }, [finalQuery]);

  return (
    <>
    
         <div>
             <button onClick={()=>setIsResponseViewed(prev => !prev)}>{isResponseViewed ?  "close" : "View Current Reponse"}</button>
             {
              isResponseViewed && <div style={{color:"white", maxWidth:"80%", textAlign:"justify"}}>
                  {response ? response : "No response! plz start conversation"}
              </div>
             }
            <button onClick={()=>setIsWholeChatViwed(prev => !prev)}>{isWholeChatViwed ?  "close" : "View Whole Chat"}</button>
            {
              isWholeChatViwed ? 
                  <div className='wholeChat' style={{width:"50rem", display:"block"}}>
                  {
                    chatHistory.length>2 ? renderWholeChat() : <div style={{color:"white"}}>"No Chat! plz start conversation"</div>
                  }  
                  </div>
              : ""
            }
             
             
          </div>
    </>
  );
};

export default Gemini;
