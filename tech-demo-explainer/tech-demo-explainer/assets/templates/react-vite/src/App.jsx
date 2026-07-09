import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="demo-container">
      <h1 className="demo-title">{{CONCEPT_NAME}}</h1>
      <p className="demo-desc">{{CONCEPT_TAGLINE}}</p>

      <div className="demo-stage">
        <div className="demo-controls">
          <button onClick={() => setCount(c => c + 1)}>
            点击触发 +1
          </button>
          <button onClick={() => setCount(0)}>
            重置
          </button>
        </div>
        <p>当前计数：{count}</p>
      </div>

      <div className="demo-explanation">
        <h3>这个 Demo 在演示什么？</h3>
        <ul>
          <li>{{EXPLAIN_POINT_1}}</li>
          <li>{{EXPLAIN_POINT_2}}</li>
          <li>{{EXPLAIN_POINT_3}}</li>
        </ul>
      </div>
    </div>
  )
}

export default App
