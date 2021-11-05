import { useState } from "react";

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const Intro = ({ children }: Props) => {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      {clicked && children}
      <div
        className={`fullscreen bg ${clicked ? "ready clicked" : "notready"}`}
      >
        <div className="stack">
          <a href="#" onClick={() => setClicked(true)}>
            {!clicked && "Click to continue"}
          </a>
        </div>
      </div>
    </>
  );
};
