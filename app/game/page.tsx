"use client"

import { useEffect, useState } from 'react';
import data from '../../questions.json'

interface YesNoProblem {
  question: string
  realAnswer: boolean
  userAnswer: boolean // true: Yes, false: No
}
const allProblems: YesNoProblem[] = data.map(d => ({...d, realAnswer: d.answer, userAnswer: true }))

function RadioSelect() {
  return (
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
  )
}

interface ControlProps {
  handlePrev: () => void
  handleNext: () => void
  isLast: () => boolean
}
function Control({ handlePrev, handleNext, isLast }: ControlProps) {
  return (
    <div>
      <button className="btn" onClick={handlePrev}>Prev</button>
      <button className="btn" onClick={handleNext}>{ isLast() ? "Submit" : "Next" }</button>
    </div>
  )
}

export default function Game() {
  const [start, setStart] = useState<number>(0)
  const [index, setIndex] = useState<number>(0)
  const numberOfProblems = 10
  const problems: YesNoProblem[] = allProblems.concat(allProblems).slice(start, start + numberOfProblems)

  useEffect(() => {
    const i = Date.now() % data.length
    setStart(i)
    setIndex(0)
  }, [])

  const handleNext = () => {
    if (isLast()) {
      console.log("cannot next")
      return
    }
    setIndex(index + 1)
  }

  const handlePrev = () => {
    if (index <= 0) {
      console.log("cannot prev")
      return
    }
    setIndex(index - 1)
  }

  const isLast = () => {
    if (index < numberOfProblems - 1) {
      return false
    }
    return true
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h2 className="text-4xl font-bold py-5">Question {index + 1}</h2>
      <div className="w-96">{problems[index].question}</div>

      <div>real: {problems[index].realAnswer ? "Yes" : "No"}</div>
      <div>user: {problems[index].userAnswer ? "Yes" : "No"}</div>
      <RadioSelect />

      <Control
        handlePrev={handlePrev}
        handleNext={handleNext}
        isLast={isLast}
      />
    </div>
  );
}
