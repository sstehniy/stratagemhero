import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const BASE_ROUND_BONUS = 75;
const STRATOGEM_COMPLETION_BONUS_PER_KEY = 86; // 86 ms per key
const TIME_BETWEEN_ROUNDS = 30; // 30 ms
const PERFECT_ROUND_BONUS = 100;
const FOLLOWING_ROUND_BONUS_ADDITION = 25;
const BASE_STRATOGEM_COUNT = 6;
const BASE_ROUND_DURATION = 1000 * 10; // 10 seconds

function App() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
