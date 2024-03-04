import { PERFECT_ROUND_BONUS } from "../constants";

export const RoundStats = ({
  currentRoundBaseBonus,
  currentRoundTimeBonus,
  isPerfectRound,
  totalScore,
}: {
  currentRoundBaseBonus: number;
  currentRoundTimeBonus: number;
  isPerfectRound: boolean;
  totalScore: number;
}) => {
  return (
    <div style={{ width: "clamp(1000px,75vw, 2000px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 40,
            color: "var(--light)",
            fontWeight: "bold",
          }}
        >
          Round Bonus
        </span>
        <span
          style={{
            fontSize: 80,
            color: "var(--yellow)",
            fontWeight: "bold",
          }}
        >
          {currentRoundBaseBonus}
        </span>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="hidden first"
      >
        <span
          style={{
            fontSize: 40,
            color: "var(--light)",
            fontWeight: "bold",
          }}
        >
          Time Bonus
        </span>
        <span
          style={{
            fontSize: 80,
            color: "var(--yellow)",
            fontWeight: "bold",
          }}
        >
          {currentRoundTimeBonus}
        </span>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="hidden second"
      >
        <span
          style={{
            fontSize: 40,
            color: "var(--light)",
            fontWeight: "bold",
          }}
        >
          Pefect Bonus
        </span>
        <span
          style={{
            fontSize: 80,
            color: "var(--yellow)",
            fontWeight: "bold",
          }}
        >
          {isPerfectRound ? PERFECT_ROUND_BONUS : 0}
        </span>
      </div>
      <div
        style={{ display: "flex", justifyContent: "space-between" }}
        className="hidden third"
      >
        <span
          style={{
            fontSize: 40,
            color: "var(--light)",
            fontWeight: "bold",
          }}
        >
          Total Score
        </span>
        <span
          style={{
            fontSize: 80,
            color: "var(--yellow)",
            fontWeight: "bold",
          }}
        >
          {totalScore}
        </span>
      </div>
    </div>
  );
};
