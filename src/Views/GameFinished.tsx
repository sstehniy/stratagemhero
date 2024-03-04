export const GameFinished = ({ totalScore }: { totalScore: number }) => {
  return (
    <>
      <div
        style={{
          color: "var(--light)",
          fontWeight: "bolder",
          fontSize: 120,
          marginBottom: 77,
          marginTop: 200,
        }}
      >
        GAME OVER
      </div>
      <h5
        style={{
          fontSize: 50,
          color: "var(--light)",
        }}
      >
        YOUR FINAL SCORE
      </h5>
      <h5
        style={{
          fontSize: 90,
          color: "var(--yellow)",
          marginTop: -20,
        }}
      >
        {totalScore}
      </h5>
    </>
  );
};
