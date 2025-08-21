import React, {useEffect, useState} from 'react'
import Tree from './components/FrameworkTree'

export default function App(){
  const [tree, setTree] = useState(null)
  useEffect(()=>{
    fetch(import.meta.env.VITE_API_URL + '/tree').then(r=>r.json()).then(setTree).catch(console.error)
  },[])
  return (
    <div style={{fontFamily:'Inter, Arial, sans-serif', padding:20}}>
      <h1>OSINT Explorer (sample)</h1>
      <p>Environment: {import.meta.env.MODE}</p>
      <div>
        {!tree ? <div>Loading...</div> : <Tree node={tree} />}
      </div>
    </div>
  )
}
