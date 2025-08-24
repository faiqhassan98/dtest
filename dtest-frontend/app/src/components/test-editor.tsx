'use client'
import { useState } from 'react'
import { Button } from './ui/button'
import { createTest } from '@/lib/api'
import { TestPassage, TestQuestion } from '@/lib/types'  // import the proper types

type Question = {
  type: 'mcq' | 'tf'
  text: string
  options?: string[]
  correctAnswer: string | boolean
}

type Passage = {
  text: string
  questions: Question[]
}

export function TestEditor() {
  const [level, setLevel] = useState('A1')
  const [passages, setPassages] = useState<Passage[]>([
    { text: '', questions: [] },
    { text: '', questions: [] },
  ])

  async function save() {
    // payload matches the type expected by createTest
  const payload: Omit<{ level: string; passages: TestPassage[]; isPublished: boolean }, '_id'> = {
  level,
  passages: passages.map(p => ({
    text: p.text,
    questions: p.questions.map(q => ({
      type: q.type,
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })) as TestQuestion[], // cast questions explicitly
  })) as TestPassage[], // cast passages explicitly
  isPublished: true,
}

    await createTest(payload)
    alert('Test created')
    window.location.reload()
  }

  return (
    <div>
      <div className="mb-3">
        <label className="mr-2">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border p-1"
        >
          <option>A1</option>
          <option>A2</option>
          <option>B1</option>
          <option>B2</option>
        </select>
      </div>

      {passages.map((p, idx) => (
        <div key={idx} className="mb-4 border p-3 rounded">
          <textarea
            placeholder={`Passage ${idx + 1} (max 1800 chars)`}
            value={p.text}
            onChange={(e) => {
              const cp = [...passages]
              cp[idx].text = e.target.value
              setPassages(cp)
            }}
            className="w-full h-28 p-2 border"
          />
          <div className="mt-2">
            <Button
              onClick={() => {
                const cp = [...passages]
                cp[idx].questions.push({
                  type: 'mcq',
                  text: 'New question',
                  options: ['A', 'B', 'C'],
                  correctAnswer: 'A',
                })
                setPassages(cp)
              }}
            >
              Add sample question
            </Button>
          </div>
          <div className="mt-2">
            {p.questions.map((q, qi) => (
              <div key={qi} className="mt-2 p-2 border rounded">
                <input
                  value={q.text}
                  onChange={(e) => {
                    const cp = [...passages]
                    cp[idx].questions[qi].text = e.target.value
                    setPassages(cp)
                  }}
                  className="w-full p-1 border"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={save}>Save Test</Button>
    </div>
  )
}
