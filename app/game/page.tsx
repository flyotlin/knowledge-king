"use client"

import { useEffect, useState } from 'react';
import data from '../../questions.json'

export default function Game() {
  const [start, setStart] = useState(0);
  useEffect(() => {
    setStart(Date.now() % data.length)
  }, [])

  const numberOfQuestion = 10
  console.log(`start:${start}`)
  // const questions = data.concat(data).slice(start, start + numberOfQuestion).map(d => <li key={d.question}>{d.question}</li>)
  const questions = data.concat(data).slice(start, start + 1)
  // const questionsLi = data.concat(data).slice(start, start + 1).map(d => <li key={d.question}>{d.question}</li>)


  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Game</h1>
      {/* <div>{start}</div> */}
      <div className="w-96">{questions[0].question}</div>
      {/* <ul>
        {questionsLi}
      </ul> */}

      <div>
        <div className="py-3">
          <span className="pr-3">Yes</span>
          <input type="radio" name="radio-yes" className="radio" defaultChecked />
        </div>
        <div className="py-3">
          <span className="pr-3">No</span>
          <input type="radio" name="radio-no" className="radio" />
        </div>
      </div>

      <button className="btn">Next</button>
      {/* <h3>Q: {qa[0].question} </h3> */}
    </div>
  );
}
