// src/App.tsx

import React from 'react';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Video Player</h1>
            <VideoPlayer />
        </div>
    );
};

export default App;
