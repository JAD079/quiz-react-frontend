import { useEffect, useState, useRef } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import "./style.scss"


const Home = () => {
    const [activePage, setActivePage] = useState(0)
    const [userName, setUserName] = useState('')
    const [currentQuiz, setCurrentQuiz] = useState(0)
    const [score, setScore] = useState(0)
    
    const [answers, setAnswers] = useState([])
    
    
    
    const [quiz, setQuiz] = useState([
        {   
            question: "Question 1 : loading",
            id : "default-idx-1",
            correctAns : [2],
            answers: [
                { 
                    ans: "loading",
                }
                ,{ 
                    ans: "loading",
                    
                },
                { 
                    ans: "loading",
                    
                },
                { 
                    ans: "loading",
                    
                }
            ]
        },
        {   
            question: "Question 2 : loading",
            id : "default-idx-2",
            correctAns : [1,3],
            answers: [
                { 
                    ans: "loading",
                }
                ,{ 
                    ans: "loading",
                    
                },
                { 
                    ans: "loading",
                    
                },
                { 
                    ans: "loading",
                    
                }
            ]
        }
    ])

    const userNameRef = useRef();

    useEffect( ()=> {
        axios.get(`http://192.168.56.101`)
          .then(res => {
            const data = JSON.parse(res.data);
            setQuiz( data.questions);
          })
    }, [])


    const handleClickStart = (e) =>{
        let user = userNameRef.current.value
        if (user){
            setUserName(user)
            let currentPage = activePage
            setActivePage(currentPage+1)
        }
    } 

    const handleClickNext = (qId) => {

        checkAnswer(qId)
        setAnswers([])

        let _currentQuiz = currentQuiz + 1
        if (_currentQuiz === quiz.length){
            let currentPage = activePage
            setActivePage(currentPage+1)
        }else{
            
            setCurrentQuiz(_currentQuiz)
        }
    } 

    const handleClickRestart = () => {
        setActivePage(0)
        setCurrentQuiz(0)
        setUserName("")
        setScore(0)
    }

    const handleClickSelectAns = (ansId) => {
        let _answers = [...answers];
        let p = _answers.indexOf(ansId); 
        if ( p > -1 ){
            _answers.splice(p, 1)
        }else{
            _answers.push(ansId)
        }
        
        setAnswers(_answers)
    }

    const checkAnswer = (qId) => {

        let _answers = answers
        let _score = score
        quiz.map(q => {
            if(qId === q.id){
                
                const correctAnswerSorted = q.correctAns.slice().sort((a, b) => a - b);
                console.log(q.id, correctAnswerSorted , _answers)
                correctAnswerSorted.length === _answers.length && _answers.slice().sort().every( (v, idx) => {
                    if(v === correctAnswerSorted[idx]){
                        _score = _score + 1
                    } 
                });    


            }
        })

        setScore(_score)

    }

    const renderAnswer = () => {
        let dom_elm = []
        let quizAnswers = quiz[currentQuiz].answers
        quizAnswers.map( (q,idx) => {
            let id = idx +1
            let p = answers.indexOf(id)
            
            dom_elm.push(   
                <Button className="btn-ans"
                    key={`ans-${currentQuiz}-${id}`} 
                    style={{background : `${p >- 1 ? "#a3ebff" : "#eeeeee"}` , color : 'black'} } 
                    variant="contained" onClick={()=> {
                    handleClickSelectAns(id)
                }}> {q.ans} </Button>
            )
        })
        return dom_elm
    }

    return (
        <div className='home-container'>
            <div className={`home-page ${activePage === 0 ? '' : 'hidden' }`} >
                <div> Logo here</div>
                <div> Bienvenu au CESI Quiz 1.0</div>
                <div className='quiz-start-action'>
                    <TextField id="outlined-basic" label="Username" variant="filled" inputRef={userNameRef} defaultValue={userName} key={`username-${userName}`}/>
                    <Button variant="contained" style={{background : "white", color : 'black'} } onClick={handleClickStart}> Commencer </Button>

                </div>
            </div>


            <div className={`quiz-page ${activePage === 1 ? '' : 'hidden' }`} >
                <div className='header-quiz'>
                    <div className='quiz'>Q: {currentQuiz+1}/{quiz.length}</div>
                    <div className='score'>score {score}</div>
                </div>
                <div className='content-quiz'>
                    <div className='container'>

                       <div className='quiz-question'>{quiz[currentQuiz].question}</div> 
                        <div className='quiz-answers'>
                            {
                                renderAnswer()
                            }
                        </div>

                    </div>
                </div>
                <div className='bottom-quiz'>
                    <div className='userName'>{userName}</div>
                    <div className="btn-action">
                    <Button 
                        variant="contained" 
                        style={{background : "white", color : 'black'} } 
                        onClick={(e) => handleClickNext(quiz[currentQuiz].id)}> Suivant </Button>
                    </div>
                </div>
            </div>

            <div className={`result-page ${activePage === 2 ? '' : 'hidden' }`} >
                <div> {`${score >= (quiz.length /2) ? 'Félicitation' : "Dommage"} `} { `${userName}`}</div>
                <div> Vous avez terminer le quiz avec un score de </div>
                <div> {score} </div>
                <Button variant="contained" style={{background : "white", color : 'black'} } onClick={ handleClickRestart}> Rejouer </Button>
            </div>                

        </div>
    )
}



export default Home
