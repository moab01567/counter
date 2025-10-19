import {useEffect, useState} from 'react'
import css from "./App.module.css"
interface CounterAPI{
    count:number
}

function App() {
  const [count, setCount] = useState<null | number>(null)

    const handleEntry = async ()=>{
      setCount(null)
         const response  = await fetch("/api/count")
        const data:CounterAPI = await  response.json();
         setCount(data.count)
    }

    const handleOnCount = async ()=>{
      setCount(null)
        const response = await fetch("/api/count", {method: "POST"})
        const data:CounterAPI = await  response.json();
        setCount(data.count)
    }
    const handleClickReset = async ()=>{
      setCount(null)
        const response = await fetch("/api/count/reset", {method: "POST"})
        const data:CounterAPI = await  response.json();
        setCount(data.count)
    }

    useEffect(() => {
        handleEntry()
    }, []);

  return (
    <>
        <div className={css.mainDiv}>
           <h1>Welcome to the sorry counter </h1>
            {count!==null? <h2>{count}</h2> : (<div className={css.loading}></div>)}
            <button onClick={handleOnCount} className={css.button}>Count</button>
            <button onClick={handleClickReset} className={css.button}>Reset</button>
        </div>
    </>
  )
}

export default App
