export const GetReady = ({ round }: { round: number }) => {
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
        GET READY
      </div>
      <h5
        style={{
          fontSize: 50,
          color: "var(--light)",
        }}
      >
        Round
      </h5>
      <h5
        style={{
          fontSize: 90,
          color: "var(--yellow)",
        }}
      >
        {round}
      </h5>
    </>
  );
};
