"use client";

import Game from "./components/Game/Index";

const words = [
  "película",
  "actor",
  "actriz",
  "director",
  "guión",
  "escena",
  "premios",
  "cámara",
  "taquilla",
  "festival",
  "estreno",
  "reparto",
  "cineasta",
  "género",
  "animación",
  "secuela",
  "trama",
  "palomitas",
  "escenografía",
  "maquillaje",
];

const Home = () => {
  return <Game words={words} />;
};

export default Home;
