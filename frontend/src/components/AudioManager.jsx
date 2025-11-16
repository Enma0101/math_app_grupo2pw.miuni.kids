
import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);


  useEffect(() => {
    const unlocked = localStorage.getItem('audioUnlocked');
    if (unlocked === 'true') {
      setAudioUnlocked(true);
    }
  }, []);


  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/music/background-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }


    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

 
  useEffect(() => {
    if (audioUnlocked) {
      localStorage.setItem('audioUnlocked', 'true');
    }
  }, [audioUnlocked]);

  const unlockAudio = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
        setAudioUnlocked(true);
       
      }
    } catch (err) {
     
    }
  };

const playClickButton = () => {
    const clickSound = new Audio("/music/menu-button-88360.mp3");
    clickSound.volume = 0.2;
    clickSound.play().catch(() => {});
  };


 const playCorrect2 = () => {
    const clickSound = new Audio("/music/correct-sound2.mp3");
    clickSound.volume = 0.2;
    clickSound.play().catch(() => {});
  };

  const playClick = () => {
    const clickSound = new Audio("/music/click-sound.mp3");
    clickSound.volume = 0.2;
    clickSound.play().catch(() => {});
  };
   const playincorrect = () => {
    const correctSound = new Audio("/music/incorrect-sound.mp3");
    correctSound.volume = 0.3;
    correctSound.play().catch(() => {});
  };

     const addnumber = () => {
    const correctSound = new Audio("/music/sumas9-1.mp3");
    correctSound.volume = 0.3;
    correctSound.play().catch(() => {});
  };



  const playCorrect = () => {
    const correctSound = new Audio("/music/correct-sound.mp3");
    correctSound.volume = 0.3;
    correctSound.play().catch(() => {});
  };

  const playAudio = async () => {
    if (audioRef.current && !isPlaying) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
  
      }
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <AudioContext.Provider
      value={{ 
        isMuted, 
        volume, 
        isPlaying,
        audioUnlocked,
        unlockAudio, 
        playClick, 
        addnumber,
        playClickButton,
        playCorrect,
        playCorrect2,
        playincorrect,
        playAudio,
        pauseAudio,
        togglePlay,
        toggleMute,
        changeVolume
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};


export const AudioControl = ({ genero }) => {
  const { isMuted, volume, toggleMute, changeVolume } = useAudio();
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div className="absolute top-5 right-30 h-20 w-20 z-50 flex items-center gap-4">
      <button
        onClick={toggleMute}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
        className="flex items-center gap-2 bg-transparent border-none cursor-pointer p-2 hover:scale-110 transition-transform"
        style={{ fontFamily: 'Kavoon, cursive', color: genero === 'mujer' ? '#FFF' : '#FFB212' }}
      >
        {isMuted ? <VolumeX className="w-12 h-12" strokeWidth={3} /> : <Volume2 className="w-12 h-12" strokeWidth={3} />}
      </button>

      {showSlider && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/70 rounded-lg p-3 backdrop-blur-sm"
          onMouseEnter={() => setShowSlider(true)}
          onMouseLeave={() => setShowSlider(false)}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-32 cursor-pointer"
            style={{ accentColor: genero === 'mujer' ? '#ED06E5' : '#FFB212' }}
          />
          <div className="text-center text-sm mt-1" style={{ fontFamily: 'Kavoon, cursive', color: '#FFF' }}>
            {Math.round(volume * 100)}%
          </div>
        </div>
      )}
    </div>
  );
};