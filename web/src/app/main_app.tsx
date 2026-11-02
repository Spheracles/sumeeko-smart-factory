import React from 'react';
import { createRoot } from 'react-dom/client';
import Shell from './Shell';
class Boundary extends React.Component<any, { err: any }> {
  constructor(p: any) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err: any) { return { err }; }
  render() {
    if (this.state.err) return <div style={{ padding: 24, color: '#fff', fontFamily: 'sans-serif' }}><h2>App 發生錯誤</h2><pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{String(this.state.err?.stack || this.state.err)}</pre><button onClick={() => location.reload()}>重新載入</button></div>;
    return this.props.children;
  }
}
createRoot(document.getElementById('root')!).render(<Boundary><Shell /></Boundary>);
