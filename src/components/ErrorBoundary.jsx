import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state={ hasError:false, err:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, err }; }
  componentDidCatch(err, info){ console.error("UI error:", err, info); }
  render(){
    if(this.state.hasError){
      return (
        <div style={{fontFamily:"system-ui",padding:24,maxWidth:700,margin:"40px auto"}}>
          <h2>Bir şeyler ters gitti 😕</h2>
          <pre style={{whiteSpace:"pre-wrap",background:"#232936",color:"#fff",
                       padding:12,borderRadius:8}}>
{String(this.state.err)}
          </pre>
          <button onClick={()=>location.reload()}
                  style={{padding:"10px 16px",borderRadius:8,cursor:"pointer"}}>
            Sayfayı Yenile
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
