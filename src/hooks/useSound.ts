import { Howl } from "howler";
import { useCallback, useRef, useState, useEffect } from "react";

export const useSound = (
  url: string,
  {
    loop,
    onEnd,
    volume,
    interrupt,
  }: {
    volume?: number;
    loop?: boolean;
    interrupt?: boolean;
    onEnd?: () => void;
  },
) => {
  const [context, setContext] = useState<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const howlerRef = useRef<Howl | null>(null);

  // Create the AudioContext on the first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      const audioContext = new AudioContext();
      setContext(audioContext);
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
    window.addEventListener("keydown", handleFirstInteraction);
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);

    return () => {
      window.removeEventListener("keydown", handleFirstInteraction);
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (context) {
      console.log("context.resume()");
      context.resume().then(() => {
        howlerRef.current = new Howl({
          src: [url],
          loop,
          volume,
          onend: onEnd,
          preload: true,
        });
      });
    }
  }, [context, url, loop, volume, onEnd]);

  const play = useCallback(async () => {
    if (!howlerRef.current) return;
    if (interrupt && howlerRef.current.playing()) {
      howlerRef.current.stop();
    }
    setIsPlaying(true);
    howlerRef.current.play();
  }, [interrupt]);

  const stop = useCallback(() => {
    if (!howlerRef.current) return;
    howlerRef.current.stop();
    setIsPlaying(false);
  }, []);

  return [play, stop, isPlaying] as const;
};
