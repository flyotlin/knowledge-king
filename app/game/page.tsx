"use client"

import { useEffect, useState } from 'react';
import data from '../../questions.json'
import Link from 'next/link';
import GameResult from '@/components/Game/result';

interface YesNoProblem {
  question: string
  realAnswer: boolean
  userAnswer: boolean // true: Yes, false: No
}
const allProblems: YesNoProblem[] = data.map(d => ({...d, realAnswer: d.answer, userAnswer: true }))

function RadioSelect({ selectedAnswer, onChange }: { selectedAnswer: boolean; onChange: (answer: boolean) => void }) {
  return (
    <div className="flex items-center justify-center mb-5">
      <div className="py-3 flex items-center">
        <input
          type="radio"
          name="radio-answer"
          className="radio"
          checked={selectedAnswer}
          onChange={() => onChange(true)}
        />
        <span className="pr-3">Yes</span>
      </div>
      <div className="py-3 flex items-center">
        <input
          type="radio"
          name="radio-answer"
          className="radio"
          checked={!selectedAnswer}
          onChange={() => onChange(false)}
        />
        <span className="pr-3">No</span>
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
    // <div className="fixed bottom-10">
    <div>
      <button className="btn mx-3" onClick={handlePrev}>Prev</button>
      <button className="btn mx-3" onClick={handleNext}>{ isLast() ? "Submit" : "Next" }</button>
    </div>
  )
}

export default function Game() {
  const [start, setStart] = useState<number>(0)
  const [index, setIndex] = useState<number>(0)
  const numberOfProblems = 10
  const problems: YesNoProblem[] = allProblems.concat(allProblems).slice(start, start + numberOfProblems)
  const [userAnswers, setUserAnswers] = useState<boolean[]>(Array(numberOfProblems).fill(true))
  const [showResult, setShowResult] = useState<boolean>(false)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)

  useEffect(() => {
    const i = Date.now() % data.length
    setStart(i)
    setIndex(0)
  }, [])

  const handleNext = () => {
    if (isLast()) {
      handleSubmit()
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
    return index >= numberOfProblems - 1
  }

  const handleAnswerChange = (answer: boolean) => {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[index] = answer
    setUserAnswers(updatedAnswers)
    problems[index].userAnswer = answer
  }

  const handleSubmit = () => {
    const correctCount = userAnswers.filter((answer, idx) => answer === problems[idx].realAnswer).length
    setCorrectAnswers(correctCount)
    setShowResult(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-400 shadow-lg z-10 text-center">
        <h2 className="text-4xl font-bold text-white">Question {index + 1}</h2>
      </header>
      <main className="flex-grow pt-20 pb-10 overflow-y-auto flex flex-col items-center justify-center">
        {showResult ? (
          <GameResult correctAnswers={correctAnswers} />
        ) : (
          <>
            <div className="w-96 bg-white p-6 rounded-lg shadow-md mb-4 mx-auto text-center">
              <p className="text-lg text-gray-800">{problems[index].question}</p>
            </div>

            <div className="fixed bottom-10">
              <RadioSelect selectedAnswer={userAnswers[index]} onChange={handleAnswerChange} />

              <Control
                handlePrev={handlePrev}
                handleNext={handleNext}
                isLast={isLast}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
