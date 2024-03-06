import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export const AudioContextContext = createContext<{
  initializeAudioContext: () => void;
  context: AudioContext | null;
}>({
  initializeAudioContext: () => {},
  context: null,
});

export const AudioContextProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [context, setContext] = useState<AudioContext | null>(null);
  const initializeAudioContext = useCallback(() => {
    if (context) return;
    const audioContext = new AudioContext();
    setContext(audioContext);
  }, [context]);
  return (
    <AudioContextContext.Provider value={{ initializeAudioContext, context }}>
      {children}
    </AudioContextContext.Provider>
  );
};

export const useAudioContext = () => {
  return useContext(AudioContextContext);
};
