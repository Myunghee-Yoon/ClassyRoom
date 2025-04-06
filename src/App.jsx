import React from 'react';
import './App.css';
import Timer from './components/Timer';
import NamePicker from './components/NamePicker';
import NoiseMeter from './components/NoiseMeter';
import WorkInstructions from './components/WorkInstructions';
import GroupMaker from './components/GroupMaker';

function App() {
  return (
    <div className="app">
      <header></header>
      <main className="widgets-container">
        <div className="widget-wide">
          <WorkInstructions />
        </div>
        <div className="widget-normal">
          <Timer />
        </div>
        <div className="widget-normal">
          <NamePicker />
        </div>
        <div className="widget-normal">
          <GroupMaker />
        </div>
        <div className="widget-normal">
          <NoiseMeter />
        </div>
      </main>
      <footer>
        <p>ClassyRoom @ 2025 │ Contenlena</p>
      </footer>
    </div>
  );
}

export default App;
