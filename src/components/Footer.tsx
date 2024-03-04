export const Footer = () => (
  <div
    style={{
      position: "fixed",
      bottom: 5,
      left: 5,
      fontSize: 12,
      color: "var(--lightgrey)",
      width: 400,
    }}
  >
    <p>
      Check out Helldivers 2 on{" "}
      <a
        href="https://store.steampowered.com/app/553850/HELLDIVERS_2/"
        target="_blank"
      >
        Steam
      </a>{" "}
      and{" "}
      <a
        href="https://www.playstation.com/en-us/games/helldivers-2/"
        target="_blank"
      >
        Playstation
      </a>
      !<br />
    </p>
    Report an issue{" "}
    <a href="https://github.com/sstehniy/stratagemhero/issues" target="_blank">
      here
    </a>
    <br />
    Not affiliated with Helldivers, Arrowhead Studios, or Playstation Studios.
    <br />
    This project is just a fan-made game to practice skills for spreading
    democrary across the universe. Not for profit!!!
  </div>
);
