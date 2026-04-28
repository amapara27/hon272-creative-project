import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import gameData from './gameData.json';

function App() {
  const [count, setCount] = useState(0);
  
  // initial states
  const [node, setNode] = useState('start');
  const [vStats, setVStats] = useState(gameData.startingStats.visible);
  const [hStats, setHStats] = useState(gameData.startingStats.hidden);
  const [epilogue, setEpilogue] = useState(false);

  // first scenario
  const scenario = gameData.nodes.find(node => node.id === node);

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
    
  }

  // displays epilogue if reached
  if(epilogue) {
    return (
      0
    );
  }

  return (
    <>
     
    </>
  )
}

export default App
