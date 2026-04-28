import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import gameData from './gameData.json';

function App() {
  
  // initial states
  const [node, setNode] = useState('start');
  const [vStats, setVStats] = useState(gameData.gameMetadata.startingStats.visible);
  const [hStats, setHStats] = useState(gameData.gameMetadata.startingStats.hidden);
  const [epilogue, setEpilogue] = useState(false);

  // first scenario
  const scenario = gameData.nodes.find(n => n.id === node);

  // choice handler function
  const handleChoice = (choice) => {
    if (choice.stat_changes?.visible) {

      // new visible stats
      const newVStats = { ...vStats };

      for (const [key, value] of Object.entries(choice.stat_changes.visible)) {
        newVStats[key] += value;
      }

      setVStats(newVStats);
    }

    if (choice.stat_changes?.hidden) {

      // new hidden stats
      const newHStats = { ...hStats }


      for (const [key, value] of Object.entries(choice.stat_changes.hidden)) {
        newHStats[key] += value;
      }

      setHStats(newHStats);
    }

    // set the next node
    if (choice.next_node === "epilogue_trigger") {
      setEpilogue(true);
    }
    else {
      setNode(choice.next_node);
    }

  }

  // builds and gets epilogue
  const getEpilogue = () => {

    // fell for the illusion
    if (hStats.inner_peace < 20 && hStats.collateral_damage > 50) {
      return gameData.epilogueLogic.conditions[0];
    } 

    // opposed social norms
    else if (hStats.inner_peace >= 60 && hStats.lives_uplifted > 50) {
      return gameData.epilogueLogic.conditions[1]; // Authentic Resistance
    } 

    // bystander 
    else if (hStats.inner_peace < 40 && hStats.lives_uplifted < 30 && hStats.collateral_damage < 30) {
      return gameData.epilogueLogic.conditions[2]; // The Apathetic Drift
    } 

    // miced
    else {
      return gameData.epilogueLogic.conditions[3]; // The Mixed Reality (Default)
    }
  }

  // displays epilogue if reached
if(epilogue) {
    const finalStory = getEpilogue();
    
    return (
      <div className="container">
        <div className="epilogue-screen">
          <h1 className="title">GRADUATION DAY</h1>
          <h2 className="subtitle">{finalStory.title}</h2>
          <p className="scenario-text">{finalStory.text}</p>
          
          <div className="final-stats">
            <h3>The Hidden Reality (True Stats):</h3>
            <p>Inner Peace: <span className="highlight">{hStats.inner_peace}</span></p>
            <p>Lives Uplifted: <span className="highlight">{hStats.lives_uplifted}</span></p>
            <p>Collateral Damage: <span className="highlight">{hStats.collateral_damage}</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* illusion stat dashboard */}
      <div className="dashboard">
        <div className="stat">Money: {vStats.money}</div>
        <div className="stat">Clout: {vStats.clout}</div>
        <div className="stat">Resume: {vStats.resume}</div>
      </div>

      {/* game content */}
      <div className="game-content">
        <p className="scenario-text">{scenario.text}</p>
        
        {/* hides placeholders */}
        {scenario.quote !== "Placeholder" && (
          <blockquote className="quote">{scenario.quote}</blockquote>
        )}
        
        {/* choices */}
        <div className="choices-container">
          {scenario.choices.map((choice, index) => (
            <button 
              key={index} 
              onClick={() => handleChoice(choice)}
              className="choice-btn"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
