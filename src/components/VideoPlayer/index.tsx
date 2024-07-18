import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './index.css';

const VideoPlayer: React.FC = () => {
    const playerRef = useRef<ReactPlayer>(null);
    const seekbarRef = useRef<HTMLDivElement>(null);
    const [url, setUrl] = useState<string>('http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    const [playing, setPlaying] = useState<boolean>(false);
    const [played, setPlayed] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [timestamps, setTimestamps] = useState<Array<{ start: number, duration: number }>>([]);
    const [currentTimestampIndex, setCurrentTimestampIndex] = useState<number>(0);
    const [showSeekbar, setShowSeekbar] = useState<boolean>(true);

    const caseTimestamps: Record<string, Array<{ start: number, duration: number }>> = {
        case1: [
            { start: 120, duration: 10 },
            { start: 300, duration: 2 },
            { start: 485, duration: 5 },
        ],
        case2: [
            { start: 90, duration: 15 },
            { start: 240, duration: 10 },
            { start: 360, duration: 20 },
        ],
        case3: [
            { start: 45, duration: 30 },
            { start: 210, duration: 5 },
            { start: 420, duration: 8 },
        ],
        case4: [
            { start: 60, duration: 20 },
            { start: 200, duration: 12 },
            { start: 340, duration: 18 },
        ],
        case5: [
            { start: 15, duration: 5 },
            { start: 150, duration: 30 },
            { start: 540, duration: 60 },
        ],
    };

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleProgress = (state: { played: number; playedSeconds: number }) => {
        setPlayed(state.played);
        resetSeekbarTimer();
    
        if (currentTimestampIndex < timestamps.length) {
            const { start, duration } = timestamps[currentTimestampIndex];
            const currentTime = state.playedSeconds;
    
            console.log(currentTime, " ", start + duration);
    
            // Check if the current time is past the end of the timestamp
            if (currentTime >= start + duration) {
                setCurrentTimestampIndex(prev => {
                    const nextIndex = prev + 1;
                    if (nextIndex < timestamps.length) {
                        playerRef.current?.seekTo(timestamps[nextIndex].start);
                        return nextIndex;
                    } else {
                        setPlaying(false); // Stop playback if no more timestamps
                        playerRef.current?.seekTo(timestamps[0].start);
                        return 0;
                    }
                });
            }
        }
    };
    

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const handleSearch = (query: string) => {
        const selectedTimestamps = caseTimestamps[query];
        if (selectedTimestamps) {
            setTimestamps(selectedTimestamps);
            setCurrentTimestampIndex(0);
            playerRef.current?.seekTo(selectedTimestamps[0].start);
            setPlaying(true);
        } else {
            alert("No cases found for this query.");
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const seekbar = seekbarRef.current;
        if (seekbar) {
            const rect = seekbar.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const newPlayed = offsetX / rect.width;
            playerRef.current?.seekTo(newPlayed, 'fraction');
            setPlayed(newPlayed);
        }
    };

    const handleSeekbarHeadDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        const mouseMoveHandler = (event: MouseEvent) => handleMouseMove(event);
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
        });
    };

    let seekbarTimer: NodeJS.Timeout;

    const resetSeekbarTimer = () => {
        clearTimeout(seekbarTimer);
        setShowSeekbar(true);
        seekbarTimer = setTimeout(() => {
            setShowSeekbar(false);
        }, 5000);
    };

    useEffect(() => {
        document.addEventListener('mousemove', resetSeekbarTimer);
        return () => {
            clearTimeout(seekbarTimer);
            document.removeEventListener('mousemove', resetSeekbarTimer);
        };
    }, []);

    const playedPercentage = played * 100;

    return (
        <div className="video-player" onMouseMove={resetSeekbarTimer}>
            <input
                type="text"
                className="search-box"
                placeholder="Search (case1, case2, ...)"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
            />
            <ReactPlayer
                ref={playerRef}
                url={url}
                playing={playing}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
                width="100%"
                height="100%"
            />
            <div className="controls">
                <button className="play-pause-btn" onClick={handlePlayPause}>
                    {playing ? 'Pause' : 'Play'}
                </button>
                <div className="duration">
                    {Math.floor(played * duration)} / {Math.floor(duration)} seconds
                </div>
            </div>
            <div
                className="progress-seekbar"
                ref={seekbarRef}
                onMouseDown={(e) => handleMouseMove(e.nativeEvent)}
                style={{ opacity: showSeekbar ? 1 : 0 }}
            >
                <div className="progress-bar" style={{ width: `${playedPercentage}%` }}></div>
                {timestamps.map((ts, index) => (
                    <div key={index} className="highlight-overlay" style={{
                        left: `${(ts.start / duration) * 100}%`,
                        width: `${(ts.duration / duration) * 100}%`
                    }}></div>
                ))}
                <div
                    className="seek-head"
                    style={{ left: `${playedPercentage}%` }}
                    onMouseDown={handleSeekbarHeadDrag}
                ></div>
            </div>
        </div>
    );
};

export default VideoPlayer;
