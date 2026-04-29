import { useState } from 'react'
import './App.css'

import gameData from './gameData.json';

function App() {
  const vStatOrder = ['money', 'clout', 'resume'];
  
  // initial states
  const [node, setNode] = useState('start');
  const [vStats, setVStats] = useState(gameData.gameMetadata.startingStats.visible);
  const [hStats, setHStats] = useState(gameData.gameMetadata.startingStats.hidden);
  const [epilogue, setEpilogue] = useState(false);

  // first scenario
  const scenario = gameData.nodes.find(n => n.id === node);

  // gets label for current year and semester
  const getTimelineLabel = () => {
    if (epilogue) {
      return 'Year 4 • Graduation';
    }

    const idMatch = node.match(/_sem(\d+)/i);
    const textMatch = scenario?.text?.match(/Semester\s+(\d+)/i);
    const semester = Number(idMatch?.[1] || textMatch?.[1] || 1);
    const year = Math.floor((semester - 1) / 2) + 1;
    const term = semester % 2 === 1 ? 'Fall' : 'Spring';

    return `Year ${year} • Semester ${semester} (${term})`;
  };

  
  // creates indicator for visual stat changes
  const vStatChanges = (choice) => {
    const vChanges = choice.stat_changes?.visible;

    if (!vChanges) {
      return [];
    }

    return vStatOrder
      .filter((statKey) => typeof vChanges[statKey] === 'number' && vChanges[statKey] !== 0)
      .map((statKey) => {
        const value = vChanges[statKey];
        return {
          key: statKey,
          label: `${value > 0 ? '+' : ''}${value} ${statKey}`,
          className: value > 0 ? 'delta-positive' : 'delta-negative',
        };
      });
  };

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
      return gameData.epilogueLogic.conditions[1];
    } 

    // bystander 
    else if (hStats.inner_peace < 40 && hStats.lives_uplifted < 30 && hStats.collateral_damage < 30) {
      return gameData.epilogueLogic.conditions[2];
    } 

    // miced
    else {
      return gameData.epilogueLogic.conditions[3];
    }
  }

  // displays epilogue if reached
if(epilogue) {
    const finalStory = getEpilogue();
    
    return (
      <div className="container">
        <div className="epilogue-screen scene-enter">
          <p className="timeline-pill">{getTimelineLabel()}</p>
          <h1 className="title">GRADUATION DAY</h1>
          <h2 className="subtitle">{finalStory.title}</h2>
          <p className="scenario-text">{finalStory.text}</p>
          <blockquote className="quote">{finalStory.quote}</blockquote>
          
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
      <header className="game-header scene-enter">
        <h1 className="game-title">The Illusion of Security</h1>
        <p className="timeline-pill">{getTimelineLabel()}</p>
      </header>

      {/* illusion stat dashboard */}
      <div className="dashboard">
        <div className="stat">Money: {vStats.money}</div>
        <div className="stat">Clout: {vStats.clout}</div>
        <div className="stat">Resume: {vStats.resume}</div>
      </div>

      {/* game content */}
      <div className="game-content scene-enter" key={node}>
        <p className="scenario-text">{scenario.text}</p>
        
        {/* hides placeholders */}
        {scenario.quote !== "Placeholder" && (
          <blockquote className="quote">{scenario.quote}</blockquote>
        )}
        
        {/* choices */}
        <div className="choices-container">
          {scenario.choices.map((choice, index) => {
            const deltas = vStatChanges(choice);

            return (
              <button 
                key={index} 
                onClick={() => handleChoice(choice)}
                className="choice-btn choice-enter"
              >
                {choice.text}
                {deltas.length > 0 && (
                  <span className="choice-delta">
                    {' ('}
                    {deltas.map((delta, deltaIndex) => (
                      <span key={delta.key} className={delta.className}>
                        {delta.label}
                        {deltaIndex < deltas.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    {')'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default App
