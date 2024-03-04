export const StartScreen = () => {
  return (
    <>
      <h1
        style={{
          color: "var(--light)",
          fontSize: 120,
          marginBottom: 100,
          marginTop: 125,
          fontWeight: "bolder",
        }}
      >
        STRATAGEM HERO
      </h1>
      <h5 style={{ color: "var(--yellow)", fontSize: 50 }}>
        Input any Stratagem Input to Start!
      </h5>
      <div style={{ display: "flex", gap: 10, position: "fixed", bottom: 40 }}>
        <div
          style={{
            fontSize: 20,
            backgroundColor: "var(--yellow)",
            padding: "8px 15px",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          w
        </div>
        <div
          style={{
            fontSize: 20,
            backgroundColor: "var(--yellow)",
            padding: "8px 15px",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          a
        </div>
        <div
          style={{
            fontSize: 20,
            backgroundColor: "var(--yellow)",
            padding: "8px 15px",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          s
        </div>
        <div
          style={{
            fontSize: 20,
            backgroundColor: "var(--yellow)",
            padding: "8px 15px",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          d
        </div>
      </div>
    </>
  );
};
