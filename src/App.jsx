function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <section
        className="glass fade-in-up"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "3rem",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 1.5rem",
            borderRadius: "50%",
            background: "var(--color-primary-soft)",
            border: "1px solid var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
            fontSize: "28px",
            boxShadow: "var(--glow-primary)",
          }}
        >
          🧠
        </div>

        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.75rem",
          }}
        >
          MindPulse{" "}
          <span className="text-primary">AI</span>
        </h1>

        <p className="text-secondary">
          Emotion Recognition & Well-being Monitoring System
        </p>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <span className="text-primary">● Aura Balance</span>
          <span className="text-muted">•</span>
          <span className="text-lavender">Frontend Ready</span>
        </div>
      </section>
    </main>
  );
}

export default App;