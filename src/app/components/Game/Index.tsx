"use client";
import "./gameStyle.css";
import { useEffect, useState } from "react";
import Grid from "./Grid/Index";
import WordList from "./WordList/WordList";
import { IWordData } from "./Types";

type IProps = {
  words: string[];
};

const Game = (props: IProps) => {
  const { words } = props;
  const [wordsData, setwordsData] = useState<IWordData[]>([]);
  const [wordsCorrect, setWordsCorrect] = useState<IWordData[]>([]);
  useEffect(() => {
    setwordsData(
      words.map((word, index) => ({
        id: index,
        word,
        value: word.toUpperCase(),
      }))
    );
  }, [words]);

  return (
    <div className="container-game">
      <Grid
        words={wordsData}
        onWordFound={(word) => {
          console.log("word found", word);
          setWordsCorrect((prev) => [...prev, word]);
        }}
      />
      <WordList words={wordsData} wordsCorrect={wordsCorrect} />
    </div>
  );
};

export default Game;
