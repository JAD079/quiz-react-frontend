import { useEffect, useState, useRef } from 'react' //hook react 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios'
import "./style.scss"

//déclaration de la finction pointée Home qui va faire tournée mon programme et être retournée 
const Home = () => {
    const [activePage, setActivePage] = useState(0) // tableau contenant l'état de la page active. État: 0 = home-page, 1 = quiz-page ,2 = result-page.
    const [userName, setUserName] = useState('') // tableau contenant le userName saisi par l'utlisateur
    const [currentQuiz, setCurrentQuiz] = useState(0) //tab contenant l'index de la question active
    const [score, setScore] = useState(0)
    const [answers, setAnswers] = useState([])
    const [correctAnswers, setCorrectAnswers] = useState([])
    const [quiz, setQuiz] = useState([
        {
            question: "Question 1 : loading",
            id: "default-idx-1",
            correctAns: [2],
            answers: [
                {
                    ans: "loading",
                }
                , {
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

    useEffect(() => {
        // on recupere la configure depuis le fichier config.json
        axios.get('/config.json').then(conf => {
            let URL_SERVER_PHP = conf.data.URL_SERVER_PHP
            // on récupére les données en format json depuis le serveur php situé à l'adresse URL_SERVER_PHP
            axios.get(URL_SERVER_PHP)
                .then(res => {
                    const data = JSON.parse(res.data);
                    setQuiz(data.questions);
                })
        })
    }, [])

    const handleClickStart = (e) => {
        let user = userNameRef.current.value
        if (user) {
            setUserName(user)
            let currentPage = activePage
            setActivePage(currentPage + 1)
        }
    }

    const handleClickNext = (qId) => {

        checkAnswer(qId)
        setAnswers([])
        setTimeout(() => {
            let _currentQuiz = currentQuiz + 1
            if (_currentQuiz === quiz.length) {
                let currentPage = activePage
                setActivePage(currentPage + 1)
            } else {
                setCorrectAnswers([])
                setCurrentQuiz(_currentQuiz)
            }
        }, 1000)

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
        if (p > -1) {
            _answers.splice(p, 1)
        } else {
            _answers.push(ansId)
        }

        setAnswers(_answers)
    }

    let checkAllAnswers = (arr) => arr.every(v => v === true)

    const checkAnswer = (qId) => {
        let _answers = answers
        let validAns = []

        quiz.map(q => {
            if (qId === q.id) {
                setCorrectAnswers(q.correctAns)
                const correctAnswerSorted = q.correctAns.sort((a, b) => a - b);

                if (correctAnswerSorted.length === _answers.length) {
                    _answers.sort().map((r, idx) => {
                        validAns.push(r === correctAnswerSorted[idx])
                    });
                }
            }
        })

        if (validAns.length && checkAllAnswers(validAns)) {
            let _score = score
            _score = _score + 1
            setScore(_score)
        }
    }

    const renderAnswers = () => {
        let dom_elm = []
        let quizAnswers = quiz[currentQuiz].answers
        quizAnswers.map((q, idx) => {
            let id = idx + 1
            let p = answers.indexOf(id)
            let bgColor = "#eeeeee"

            if (correctAnswers.length) { // j'ai choisi les réponses et cliquer sur suivant
                if (correctAnswers.indexOf(id) > -1) { //si l'id de la réponse est dans le tableau coorectAnswer
                    bgColor = "#80ed99"
                } else {
                    bgColor = "#e01e37"
                }
            } else { // l'utilisateur entrain de choisir sa réponse mais pas cliquer sur next cad le tableau correctanswer est vide
                bgColor = p > - 1 ? "#caf0f8" : "#eeeeee"
            }

            dom_elm.push(
                <Button className="btn-answer"
                    key={`ans-${currentQuiz}-${id}-${new Date().getTime()}`}
                    style={{ background: `${bgColor}`, color: 'black' }}
                    variant="contained" onClick={() => {
                        handleClickSelectAns(id)
                    }}> {q.ans} </Button>
            )
        })
        return dom_elm
    }

    return (
        <div className='home-container'>
            <div className={`home-page ${activePage === 0 ? '' : 'hidden'}`} >
                <h2> Bienvenue au Quizesi </h2>
                <p>Entrez le Username de votre choix et cliquez sur COMMENCER</p>
                <div className='quiz-start-action'>
                    <TextField id="outlined-basic" label="Username" variant="filled" inputRef={userNameRef} defaultValue={userName} key={`username-${userName}`} />
                    <Button className="btn" onClick={handleClickStart}> Commencer </Button>
                </div>
            </div>

            <div className={`quiz-page ${activePage === 1 ? '' : 'hidden'}`} >
                <div className='header-quiz'>
                    <div className='num-question'>Question: {currentQuiz + 1}/{quiz.length}</div>
                    <div className='score'>Score: {score}/{quiz.length}</div>
                </div>
                <div className='container'>
                    <div className='quiz-question'>{quiz[currentQuiz].question}</div>
                    <div className='quiz-answers'>
                        {
                            renderAnswers()
                        }
                    </div>
                </div>
                <div className='bottom-quiz'>
                    <div className='userName'>{userName}</div>
                    <Button className="btn-next" variant="contained" onClick={(e) => handleClickNext(quiz[currentQuiz].id)}> Suivant </Button>
                </div>
            </div>

            <div className={`result-page ${activePage === 2 ? '' : 'hidden'}`} >
                <div className='message'> {`${score >= (quiz.length / 2) ? 'Félicitation' : "Dommage"} `} {`${userName}`}</div>
                <div className="note"> Vous avez eu {`${score}`} bonnes réponses sur {`${quiz.length}`}</div>
                <Button className="btn" variant="contained" onClick={handleClickRestart}> Rejouer </Button>
            </div>
        </div>
    )
}

export default Home
