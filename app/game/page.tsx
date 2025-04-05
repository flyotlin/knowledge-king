"use client"

import { useEffect, useState } from 'react';
import GameResult from '@/components/Game/result';
import axios from 'axios';
import { getWalletAddress } from '@/utils/wallet';

interface YesNoProblem {
  id: number
  question: string
  realAnswer: boolean
  userAnswer: boolean // true: Yes, false: No
}

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

// 2. create quiz if not exist (`POST /quiz`)
// 3. get quiz questions by quiz id (`GET /quiz/:quiz_id`)
// 4. show quiz questions and let user answer
// 5. verify quiz (`POST /quiz/:quiz_id/verify`, [userAnswers]), and backend send reward
export default function Game() {
  const [start, setStart] = useState<number>(0)
  const [index, setIndex] = useState<number>(0)
  const numberOfProblems = 10
  const [problems, setProblems] = useState<YesNoProblem[]>([])
  // const problems: YesNoProblem[] = allProblems.concat(allProblems).slice(start, start + numberOfProblems)
  const [userAnswers, setUserAnswers] = useState<boolean[]>(Array(numberOfProblems).fill(true))
  const [showResult, setShowResult] = useState<boolean>(false)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true);
  const [quizId, setQuizId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const createQuiz = async () => {
      try {
        const address = await getWalletAddress()
        console.log(`create quiz: address: ${address}`)
        const response = await axios.post(`http://localhost:8000/quiz?user_id=${address}`)
        const qs = response.data.questions
        setProblems(qs.map(q => ({
          id: q.id,
          question: q.question,
          realAnswer: q.answer,
          userAnswer: true,
        })))
        setQuizId(response.data.quiz_id)
      } catch (error) {
        console.error("failed to create quiz")
      } finally {
        setLoading(false)
      }
    }

    createQuiz()
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const handleSubmit = async () => {
    // send verify
    const createQuiz = async () => {
      try {
        const address = await getWalletAddress()
        console.log(`verify quiz: address: ${address}`)
        const response = await axios.post(`http://localhost:8000/quiz/${quizId}/verify`,
          problems.map(p => (p.userAnswer))
        )
        console.log(`verify quiz: response: ${response}`)
        const n = response.data.correct_answers
        setCorrectAnswers(n)
        setShowResult(true)
      } catch (error) {
        console.error(`failed to verify quiz: ${error}`)
      }
    }
    await createQuiz()
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
