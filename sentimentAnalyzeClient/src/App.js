import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';
import axios from 'axios';

class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }
  
  renderTextArea = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
      mode: "text",
      sentimentOutput:[],
      sentiment:true
    })
    } 
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
      mode: "url",
      sentimentOutput:[],
      sentiment:true
    })
    }
  }

  sendForSentimentAnalysis = () => {
    this.setState({sentiment:true});
    let ret = "";
    let url = ".";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);
    ret.then((response)=>{

      //Include code here to check the sentiment and fomrat the data accordingly

      
      let output = response.data.result;
      let sentimentLabel;
    
      if(output.sentiment!=null){
            sentimentLabel = output.sentiment.document.label;
      }else if(output.entities[0]!=null){
          sentimentLabel = output.entities[0].sentiment.label;
      }else{
          sentimentLabel = output.keywords[0].sentiment.label;
      }
      if(sentimentLabel === "positive") {
        output = <div style={{color:"green",fontSize:20}}>The Sentiment for given text or url is: {sentimentLabel}</div>
      } else if (sentimentLabel === "negative"){
        output = <div style={{color:"red",fontSize:20}}>The Sentiment for given text or url is: {sentimentLabel}</div>
      } else {
        output = <div style={{color:"yellow",fontSize:20}}>The Sentiment for given text or url is: {sentimentLabel}</div>
      }
      this.setState({sentimentOutput:output});
    });
  }

  sendForEmotionAnalysis = () => {
    this.setState({sentiment:false});
    let ret = "";
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion/?text="+document.getElementById("textinput").value;
    }
    ret = axios.get(url);

    ret.then((response)=>{
        let output = response.data.result;
        if(output.emotion != null){
            this.setState({sentimentOutput:<EmotionTable emotions={output.emotion.document.emotion}/>});
        }
        else if(output.entities[0] != null){
            this.setState({sentimentOutput:<EmotionTable emotions={output.entities[0].emotion}/>});
        }else{
            this.setState({sentimentOutput:<EmotionTable emotions={output.keywords[0].emotion}/>});
        }
      
    })
  }
  

  render() {
    return (  
      <div className="App">
      <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
        <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
        <br/><br/>
        {this.state.innercomp}
        <br/>
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br/>
            {this.state.sentimentOutput}
      </div>
    );
    }
}

export default App;
