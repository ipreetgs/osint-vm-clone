import React from 'react'

function Node({n, level=0}){
  return (
    <div style={{paddingLeft: level*12, marginBottom:6}}>
      {n.url ? <a href={n.url} target='_blank' rel='noreferrer'>{n.title}</a> : <strong>{n.title}</strong>}
      {(n.children || []).map(c => <Node key={c.id} n={c} level={level+1} />)}
    </div>
  )
}

export default function FrameworkTree({node}){
  return <div>{node ? <Node n={node} /> : null}</div>
}
