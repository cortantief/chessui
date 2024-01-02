import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { ChessBoard } from "./ChessBoard/ChessBoard";

enum Page {
  Main,
  Game,
}
function Game() {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <ChessBoard />
      <div className="chess-history"></div>
    </div>
  );
}

function App() {
  let [gamePhase, setGamePase] = useState(Page.Game);
  return (
    <div>
      <main
        style={{
          width: "calc(100% - 20px)",
          height: "calc(100vh - 20px)",
          background: "red",
          margin: "auto",
        }}
      >
        {gamePhase === Page.Main ? <strong>ss</strong> : <Game />}
      </main>
    </div>
  );
}
export default App;
