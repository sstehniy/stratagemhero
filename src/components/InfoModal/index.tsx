import { createPortal } from "react-dom";
import styles from "./styles.module.css"; // Updated import to match new CSS module file
import { useState } from "react";

const InfoModal = ({ onClose }: { onClose: () => void }) => {
  return createPortal(
    <div className={styles.overlayContainer} onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <p>
          Check out Helldivers 2 on{" "}
          <a
            href="https://store.steampowered.com/app/553850/HELLDIVERS_2/"
            target="_blank"
            className={styles.link}
          >
            Steam
          </a>{" "}
          and{" "}
          <a
            href="https://www.playstation.com/en-us/games/helldivers-2/"
            target="_blank"
            className={styles.link}
          >
            Playstation
          </a>
          !<br />
        </p>
        Report an issue{" "}
        <a
          href="https://github.com/sstehniy/stratagemhero/issues"
          target="_blank"
          className={styles.link}
        >
          here
        </a>
        . Not affiliated with Helldivers, Arrowhead Studios, or Playstation
        Studios.
        <br />
        This project is just a fan-made game to practice skills for spreading
        democracy across the universe. Not for profit!!!
      </div>
    </div>,
    document.getElementById("portal")!,
  );
};

export const InfoModalButton = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <>
      <button
        tabIndex={-1}
        className={styles.overlayButton}
        onClick={() => {
          setShowOverlay(!showOverlay);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M1 21L12 2l11 19zm3.45-2h15.1L12 6zM12 18q.425 0 .713-.288T13 17q0-.425-.288-.712T12 16q-.425 0-.712.288T11 17q0 .425.288.713T12 18m-1-3h2v-5h-2zm1-2.5"
          />
        </svg>
      </button>
      {showOverlay && (
        <InfoModal
          onClose={() => {
            setShowOverlay(false);
          }}
        />
      )}
    </>
  );
};
