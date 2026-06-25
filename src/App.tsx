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

const screenshotScreens: Screen[] = ['landing', 'select', 'analysis', 'prep', 'cooking', 'result'];

const getScreenshotScreen = (): Screen | null => {
  const shot = new URLSearchParams(window.location.search).get('shot');
  return screenshotScreens.includes(shot as Screen) ? (shot as Screen) : null;
};

function App() {
  const screenshotScreen = getScreenshotScreen();
  const screenshotSong = songs.find((song) => song.id === 'dafengchui') ?? songs[0];
  const screenshotSelection = createDefaultSelection(screenshotSong);
  const screenshotIngredients = Object.values(screenshotSelection).filter(Boolean) as IngredientOption[];
  const [screen, setScreen] = useState<Screen>(screenshotScreen ?? 'landing');
  const [selectedSong, setSelectedSong] = useState<Song | null>(screenshotScreen ? screenshotSong : null);
  const [selection, setSelection] = useState<SelectionState>(() => screenshotSelection);
  const [cookedItems, setCookedItems] = useState<IngredientOption[]>(
    screenshotScreen === 'cooking' || screenshotScreen === 'result' ? screenshotIngredients.slice(0, 3) : [],
  );
  const [seasonings, setSeasonings] = useState<string[]>(
    screenshotScreen === 'cooking' || screenshotScreen === 'result' ? ['chili', 'ice', 'honey', 'rain'] : [],
  );
  const [heat, setHeat] = useState<'low' | 'medium' | 'high'>(screenshotScreen === 'cooking' ? 'high' : 'medium');

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
    <main className={screenshotScreen ? 'app-shell is-shot' : 'app-shell'}>
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
