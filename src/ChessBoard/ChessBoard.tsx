import "./ChessBoard.css";

import Pawn from "../assets/pawn.svg";
import king from "../assets/king.svg";
import Queen from "../assets/queen.svg";
import Rook from "../assets/rook.svg";
import Bishop from "../assets/bishop.svg";
import knight from "../assets/knight.svg";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import {
  Board,
  MAX_COLUMN,
  MAX_ROW,
  Piece,
  PieceType,
  Position,
} from "../class/Board";

function getPieceIconBlack(t: PieceType) {
  switch (t) {
    case PieceType.Bishop:
      return Bishop;
    case PieceType.King:
      return king;
    case PieceType.Knight:
      return knight;
    case PieceType.Queen:
      return Queen;
    case PieceType.Rook:
      return Rook;
    default:
      return Pawn;
  }
}

async function getPieces(): Promise<Piece[]> {
  return await invoke("new_game");
}

interface ChessCellProp {
  piece?: Piece;
}
function ChessCell({ piece }: ChessCellProp) {
  return (
    <div>
      {piece ? (
        <img src={getPieceIconBlack(piece.kind)} alt={piece.kind} />
      ) : (
        piece
      )}
    </div>
  );
}

function makeClassName(i: number, clickable: boolean, isProposition: boolean) {
  let c = "chess-cell";
  const row = Math.floor(i / MAX_ROW);
  const column = i % MAX_COLUMN;
  const odd = "odd";
  const even = "even";
  if (isProposition) c += " proposition";
  else if (row % 2 === 0) {
    c = c + " " + (column % 2 ? odd : even);
  } else c += " " + (column % 2 ? even : odd);
  if (clickable) c += " clickable";
  return c;
}

function generatePosition(i: number): Position {
  const row = MAX_ROW - Math.floor(i / MAX_ROW) - 1;
  const column = i % MAX_COLUMN;

  const pos = { row, column };
  return pos;
}

function isProposition(propositions: Position[], position: Position) {
  return !!propositions.find(
    (p) => p.row === position.row && p.column === position.column
  );
}

function Body() {}

export function ChessBoard() {
  const [board, setBoard] = useState(new Board([]));
  const [propositions, setPropositions] = useState<Position[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece>();
  useEffect(() => {
    getPieces().then((pieces) => setBoard(new Board(pieces)));
  }, []);
  let arr = [];
  for (const row of board.getBoard()) {
    for (const piece of row) {
      arr.push(piece);
    }
  }
  return (
    <div className="chess-board">
      {arr.map((piece, i) => {
        const isPieceTurn = !!piece && board.isPieceTurn(piece);
        const pos = generatePosition(i);
        const isProp = isProposition(propositions, pos);
        return (
          <div
            key={i}
            className={makeClassName(i, isPieceTurn, isProp)}
            onClick={() => {
              if (isPieceTurn) {
                board.getProposition(piece).then(setPropositions);
                setSelectedPiece(piece);
              } else if (isProp) {
                board.movePiece(selectedPiece!, pos).then((e) => {
                  setSelectedPiece(undefined);
                  setPropositions([]);
                  if (!e) return;

                  setBoard(new Board(board.getPieces(), board.swapTurn()));
                });
              }
            }}
          >
            <ChessCell piece={piece} />
          </div>
        );
      })}
    </div>
  );
}
