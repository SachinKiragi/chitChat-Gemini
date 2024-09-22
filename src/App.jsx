import React, { useEffect, useRef, useState } from 'react'
import Gemini from './Gemini'
import { MessageContextprovider } from './ConversationContext/Context';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const App = () => {
  

  const [query, setQuery] = useState('');
  const [finalQuery, setFinalQuery] = useState('');
  const [response, setRespone] = useState('');
  const [timeOutId, setTimeOutId] = useState(null);


  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const stopListening = () => {
    SpeechRecognition.stopListening()
    speechSynthesis.cancel();

  };

  if (!browserSupportsSpeechRecognition) {
    return <h1>No support</h1>;
  }

  useEffect(()=>{

    const prev = transcript;

    const startNewTimeOut = ()=>{

        if(timeOutId){
          clearTimeout(timeOutId);
        }
        
        setTimeOutId(setTimeout(() => {
          if(transcript==prev && transcript){
              setFinalQuery(transcript);
              resetTranscript();
            }
        }, 2000))
    
    } 

    startNewTimeOut();
  }, [transcript])

  return (
    <MessageContextprovider value={{finalQuery:finalQuery, setFinalQuery:setFinalQuery, response:response, setRespone:setRespone, startListening:startListening, stopListening:stopListening}} >

        <div>

           <div className='conversationBtns'>
              <button onClick={startListening}>start conversation</button>
              <button onClick={stopListening}>stop conversation</button>
              <button onClick={()=>window.location.reload()}>clear conversation</button>
           </div>

            {/* <textarea onChange={(e)=>setQuery(e.target.value)} readOnly={false} />
            <button onClick={()=>setyFinalQuery(query)}>submit</button> */}
            <Gemini/>
            {/* <div className='response'>
               {response}
            </div> */}

        </div>
    </MessageContextprovider>
    
  )
}

export default App
