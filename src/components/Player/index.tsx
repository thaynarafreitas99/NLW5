import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        clearPlayerState,
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current){
            return;
        }
        if (isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        audioRef.current.currentTime = 0; // sempre que mudar de audio comecar do tempo 0
        // audioRef.current.currentTime tempo atual do player.
        // este evento dispara quando nosso audio estiver tocando. 
        audioRef.current.addEventListener('timeupdate', () => {
          setProgress(Math.floor(audioRef.current.currentTime));
        });
      } 
    
      function handleSeek(amount: number) {
        // amount duração que o usuario jogou a bolinha.
        audioRef.current.currentTime = amount;
        setProgress(amount);
      }
    
      function handleEpisodeEnded() {
        if (hasNext) {
          playNext();
          return;
        }
    
        clearPlayerState();
      }

    const episode = episodeList[currentEpisodeIndex]
    const episodeTotalDuration = convertDurationToTimeString(episode?.duration ?? 0);
    const episodeCurrentDuration = convertDurationToTimeString(progress);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                {/* Com ? ele verifica primeiro e depois coloca pra trocar */}
                <strong> Tocando agora</strong>
            </header>

            { episode ?  (
               <div className={styles.currentEpisode}>
                   <Image 
                    width={592} 
                    height={592} 
                    src={episode.thumbnail} 
                    objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
               </div>
            ) : (
                <div className={styles.emptyPlayer}>
                <strong> Selecione um podcast para ouvir</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                       {episode ? 
                        (
                            <Slider 
                            max={episode.duration}
                            value={progress}
                            onChange={handleSeek}
                            trackStyle={{ backgroundColor: '#04d361'}}
                            railStyle={{ backgroundColor: '#9f75ff'}}
                            handleStyle={{ backgroundColor:' #04d361', borderWidth: 4}}
                            />
                        ) 
                       : 
                       (
                            <div className={styles.emptySlider} /> 
                       )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio 
                    src={episode.url}
                    ref={audioRef}
                    autoPlay
                    loop={isLooping}
                    onEnded={handleEpisodeEnded}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener} // quando começar a carregar os dados do audio.
                  />
                )}

                <div className={styles.buttons}>
                <button
                    type="button"
                    disabled={!episode || episodeList.length === 1}
                    onClick={toggleShuffle}
                    className={isShuffling ? styles.isActive : ''}
                >
                    <img src="/shuffle.svg" alt="Embaralhar"/>
                </button>

                <button
                type="button"
                disabled={!episode || !hasPrevious}
                onClick={playPrevious}
                >
                    <img src="/play-previous.svg" alt="Tocar anterior"/>
                </button>

                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext }>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button
                    type="button"
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={isLooping ? styles.isActive : ''}
                    >
                    <img src="/repeat.svg" alt="Repetir"/>
                    </button>

                </div>
            </footer>
        </div>
    );
}