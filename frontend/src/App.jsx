import React, {useEffect, useState} from 'react'
import Tree from './components/FrameworkTree'

export default function App(){
  const [tree, setTree] = useState(null)
  useEffect(()=>{
    fetch((import.meta.env.VITE_API_URL || '/api') + '/tree').then(r=>r.json()).then(setTree).catch(console.error)
  },[])

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>OSINT Explorer</h2>
        <p className="muted">Sample directory</p>
        <p className="muted"><a href="/api/health" target="_blank">Health</a></p>
      </aside>
      <main className="content">
        <h1>Resources</h1>
        {!tree ? <p>Loading…</p> : <Tree node={tree} />}
      </main>
    </div>
  )
}
