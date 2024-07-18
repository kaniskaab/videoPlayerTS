import React, { useState, useRef, ChangeEvent } from 'react';

interface VideoFile {
  file: File;
  preview: string;
}

const VideoUploader: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files).map(file => ({
        file: file,
        preview: URL.createObjectURL(file)
      }));
      setVideos(prev => [...prev, ...newVideos]);
    }
  };

  const removeVideo = (index: number) => {
    setVideos(prev => {
      const newVideos = [...prev];
      URL.revokeObjectURL(newVideos[index].preview);
      newVideos.splice(index, 1);
      return newVideos;
    });
  };

  const clearAll = () => {
    videos.forEach(video => URL.revokeObjectURL(video.preview));
    setVideos([]);
  };

  const handleUpload = () => {
    videos.forEach((video, index) => {
      console.log(`Video ${index + 1}:`);
      console.log(`Name: ${video.file.name}`);
      console.log(`Size: ${video.file.size} bytes`);
      console.log(`Type: ${video.file.type}`);
      console.log('---');
    });
    // Implement your upload logic here
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/*"
        multiple
        style={{ display: 'none' }}
      />
      <button onClick={() => fileInputRef.current?.click()}>Select Videos</button>
      <button onClick={clearAll}>Clear All</button>
      <button onClick={handleUpload}>Upload</button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {videos.map((video, index) => (
          <div key={index} style={{ margin: '10px', position: 'relative' }}>
            <video width="200" height="150" controls>
              <source src={video.preview} type={video.file.type} />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => removeVideo(index)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoUploader;