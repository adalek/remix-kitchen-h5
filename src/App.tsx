import { useEffect, useMemo, useState } from 'react';
import { loadTracks, resetAllTracks, stopTransport } from './audio/audioEngine';
import LandingScreen from './components/LandingScreen';
import SongSelectScreen from './components/SongSelectScreen';
import RecipeAnalysisScreen from './components/RecipeAnalysisScreen';
import PrepScreen from './components/PrepScreen';
import CookingScreen from './components/CookingScreen';
import ResultScreen from './components/ResultScreen';
import { audioManifest, ingredientOptions, songs, type IngredientCategory, type IngredientOption, type Song } from './data/songManifest';

type Screen = 'landing' | 'select' | 'analysis' | 'prep' | 'cooking' | 'result';

export type SelectionState = Record<IngredientCategory, IngredientOption | null>;

const createDefaultSelection = (song: Song): SelectionState => ({
  base: song.originalIngredients.find((item) => item.category === 'base') ?? ingredientOptions.base[0],
  bass: song.originalIngredients.find((item) => item.category === 'bass') ?? ingredientOptions.bass[0],
  chords: song.originalIngredients.find((item) => item.category === 'chords') ?? ingredientOptions.chords[0],
  atmosphere: song.originalIngredients.find((item) => item.category === 'atmosphere') ?? ingredientOptions.atmosphere[0],
  vocal: song.originalIngredients.find((item) => item.category === 'vocal') ?? null,
});

function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selection, setSelection] = useState<SelectionState>(() => createDefaultSelection(songs[0]));
  const [cookedItems, setCookedItems] = useState<IngredientOption[]>([]);
  const [seasonings, setSeasonings] = useState<string[]>([]);
  const [heat, setHeat] = useState<'low' | 'medium' | 'high'>('medium');

  useEffect(() => {
    loadTracks(audioManifest);
    return () => {
      stopTransport();
      resetAllTracks();
    };
  }, []);

  const currentSong = selectedSong ?? songs[0];

  const selectedIngredients = useMemo(
    () => Object.values(selection).filter(Boolean) as IngredientOption[],
    [selection],
  );

  const chooseSong = (song: Song) => {
    stopTransport();
    resetAllTracks();
    setSelectedSong(song);
    setSelection(createDefaultSelection(song));
    setCookedItems([]);
    setSeasonings([]);
    setHeat('medium');
    setScreen('analysis');
  };

  const cookAgain = () => {
    stopTransport();
    resetAllTracks();
    setCookedItems([]);
    setSeasonings([]);
    setHeat('medium');
    setScreen('prep');
  };

  const returnToPrep = () => {
    stopTransport();
    resetAllTracks();
    setCookedItems([]);
    setSeasonings([]);
    setScreen('prep');
  };

  return (
    <main className="app-shell">
      <div className="phone-frame">
        {screen === 'landing' && <LandingScreen onStart={() => setScreen('select')} />}
        {screen === 'select' && <SongSelectScreen songs={songs} onBack={() => setScreen('landing')} onSelect={chooseSong} />}
        {screen === 'analysis' && (
          <RecipeAnalysisScreen
            song={currentSong}
            onBack={() => setScreen('select')}
            onNext={() => setScreen('prep')}
          />
        )}
        {screen === 'prep' && (
          <PrepScreen
            song={currentSong}
            selection={selection}
            onChange={setSelection}
            onBack={() => setScreen('analysis')}
            onNext={() => setScreen('cooking')}
          />
        )}
        {screen === 'cooking' && (
          <CookingScreen
            song={currentSong}
            ingredients={selectedIngredients}
            cookedItems={cookedItems}
            setCookedItems={setCookedItems}
            seasonings={seasonings}
            setSeasonings={setSeasonings}
            heat={heat}
            setHeat={setHeat}
            onBack={returnToPrep}
            onServe={() => setScreen('result')}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            song={currentSong}
            ingredients={cookedItems}
            seasonings={seasonings}
            heat={heat}
            onCookAgain={cookAgain}
            onHome={() => {
              stopTransport();
              resetAllTracks();
              setScreen('landing');
            }}
          />
        )}
      </div>
    </main>
  );
}

export default App;
