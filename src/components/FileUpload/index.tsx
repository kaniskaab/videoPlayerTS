import React, { useState, useRef, useCallback } from 'react';

interface VideoFile {
  file: File;
  preview: string;
  progress: number;
}

const VideoUploader: React.FC = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addVideos = useCallback((files: FileList) => {
    const newVideos = Array.from(files).map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      progress: 0
    }));
    setVideos(prev => [...prev, ...newVideos]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addVideos(e.target.files);
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

      // Simulating upload with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setVideos(prev => 
          prev.map((v, i) => i === index ? { ...v, progress } : v)
        );
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addVideos(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: isDragging ? '2px dashed blue' : '2px dashed grey',
        padding: '20px',
        minHeight: '300px'
      }}
    >
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
            {video.progress > 0 && (
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: `${video.progress}%`,
                height: '5px',
                background: 'green'
              }} />
            )}
          </div>
        ))}
      </div>
      {isDragging && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}>
          Drop videos here
        </div>
      )}
    </div>
  );
};

export default VideoUploader;