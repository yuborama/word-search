"use client";

import "./wordListStyle.css";
import { IWordData } from "../Types";

type IProps = {
  words: IWordData[];
  wordsCorrect: IWordData[];
};

const WordList = (props: IProps) => {
  const { words, wordsCorrect } = props;
  return (
    <div className="word-list">
      <h2>Word List</h2>
      <ul>
        {words.map((word) => {
          const isCorrect = wordsCorrect.some(
            (correctWord) => correctWord.word === word.word
          );

          return (
            <li
              key={`word-List${word.id}`}
              className={isCorrect ? "correct-word" : ""}
            >
              {word.word}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WordList;
