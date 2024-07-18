// src/App.tsx

import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {

    return (
        <div className="App">
            <h1>Video Player</h1>
            <VideoPlayer />
            <h1>Video Upload</h1>
            <FileUpload 
    />        </div>
    );
};

export default App;
