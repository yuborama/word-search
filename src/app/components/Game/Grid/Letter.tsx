import { useMemo } from "react";

type Iprops = {
  letter: string;
};

const generateRandomCharacter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

const LetterComponent = (props: Iprops) => {
  const { letter } = props;
  const newLetter = useMemo(() => generateRandomCharacter(), []);
  return <>{letter === "x" ? newLetter : letter}</>;
};

export default LetterComponent;
