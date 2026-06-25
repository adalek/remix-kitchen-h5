type LandingScreenProps = {
  onStart: () => void;
};

function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <section className="screen landing-screen">
      <div className="landing-hero">
        <div className="steam steam-one" />
        <div className="steam steam-two" />
        <div className="pot-logo">🍳</div>
      </div>
      <div>
        <p className="eyebrow">AI Music Remix Game</p>
        <h1>Remix Kitchen</h1>
        <h2>音乐私厨</h2>
        <p className="subtitle">让 AI 把音乐做成你喜欢的味道</p>
      </div>
      <button className="primary-button" type="button" onClick={onStart}>
        开始做菜
      </button>
    </section>
  );
}

export default LandingScreen;
