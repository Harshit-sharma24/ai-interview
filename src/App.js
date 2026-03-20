import React, { useState } from "react";
import "./App.css";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.REACT_APP_GROQ_KEY,
  dangerouslyAllowBrowser: true
});

function App() {
  const [topic, setTopic] = useState("");
  const [num, setNum] = useState(5);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic || !num) {
      alert("Please enter topic and number");
      return;
    }

    setLoading(true);
    setData([]);

    const prompt = `
Generate ${num} interview questions with answers for ${topic}.

Format strictly like:
Q1: question
A1: answer

Do not use markdown or ** symbols.
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.choices[0].message.content;

    const blocks = text.split(/Q\d+:/).filter(Boolean);

    const parsed = blocks.map((block) => {
      const parts = block.split(/A\d+:/);
      return {
        question: parts[0]?.trim(),
        answer: parts[1]?.trim()
      };
    });

    setData(parsed);
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="card">
        <h1>🤖 AI Mock Interviewer</h1>
        <p className="subtitle">Practice real interview questions instantly</p>

        <input
          type="text"
          placeholder="Enter topic (React, Java...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
        />

        <button onClick={generate}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>

        <div className="output">
          {data.map((item, index) => (
            <div key={index} className="qa-card">
             <div className="question">
    Q{index + 1}: {item.question}
  </div>

  <div className="answer">
    A{index + 1}: {item.answer}
  </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;