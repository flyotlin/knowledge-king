"use client"

import { useEffect, useState } from 'react';
import GameResult from '@/components/Game/result';
import axios from 'axios';
import { approve, getWalletAddress, initPlayer, playGame } from '@/utils/wallet';

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
  loading: boolean
}
function Control({ handlePrev, handleNext, isLast, loading }: ControlProps) {
  return (
    <div>
      <button className="btn mx-3" onClick={handlePrev}>Prev</button>
      {/* <button className="btn mx-3" onClick={handleNext}>{ isLast() ? "Submit" : "Next" }</button> */}
      {
        loading ?
        (<Spinner />) :
        (<button className="btn mx-3" onClick={handleNext}>{ isLast() ? "Submit" : "Next" }</button>)
      }
    </div>
  )
}

function Spinner() {
  return (

<div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
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
    const initialize = async () => {
      await approve()
      const address = await getWalletAddress()
      await initPlayer(address!)
      await playGame()
      await createQuiz()
    }

    // const play = async () => {
    //   try {
    //     // const address = await getWalletAddress()
    //     // await initPlayer(address!)
    //     await playGame()
    //   } catch (error) {
    //     console.error(`Failed to play a new game: ${error}`)
    //   }
    // }

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

    initialize()
    // play()
    // createQuiz()
  }, []);

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
    setLoading(true)
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
    setLoading(false)
  }

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-300 to-blue-500">
      <header className="fixed top-0 left-0 right-0 p-4 bg-blue-400 shadow-lg z-10 text-center">
        <h2 className="text-4xl font-bold text-white">Question {index + 1}</h2>
      </header>
      <main className="flex-grow pt-20 pb-10 overflow-y-auto flex flex-col items-center justify-center">
        {showResult ? (
          <GameResult correctAnswers={correctAnswers} />
        ) : (
          loading ?
          (
            <Spinner />
          ) :
          (
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
                loading={loading}
              />
            </div>
          </>
          )
        )}
      </main>
    </div>
  );
}
