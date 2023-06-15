import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './containers/home'

function App() {
  const [count, setCount] = useState(0)
  const [ready, setReady] = useState(false)


  useEffect(() => {
    
  });

  const clickHandler = (e) => {
    console.log("j'ai cliqué sur le bouton")
    console.log("avant le click - la valeur du count est", count)
    let new_count = count;
    new_count += 1 
    setCount(new_count)


    //changer l'etat de ready a true quand la valeur du compteur = 10
    if (new_count >= 10){
      setReady(true)
    }

  }


  return (
    <Home />
  )
}

export default App

