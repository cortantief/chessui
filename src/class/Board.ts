import { invoke } from "@tauri-apps/api";

export const MAX_ROW = 8;
export const MAX_COLUMN = MAX_ROW;
export enum PieceType {
  Pawn = "Pawn",
  King = "King",
  Queen = "Queen",
  Rook = "Rook",
  Bishop = "Bishop",
  Knight = "Knight",
}

export interface Piece extends Position {
  kind: PieceType;
  white: true;
}
export interface Position {
  row: number;
  column: number;
}

export enum Turn {
  White = "White",
  Black = "Black",
}
function makeCorrectRow(row: number) {
  return MAX_ROW - row - 1;
}

type board = (Piece | undefined)[][];

function makePositionId(position: Position): number {
  return position.row * MAX_ROW + position.column;
}
export class Board {
  private pieces: Piece[];
  private selectedPiece: Piece | undefined;
  private turn: Turn;
  private propositions: Map<number, Position[]> = new Map();
  private board: board;

  constructor(pieces: Piece[], turn: Turn = Turn.White) {
    this.pieces = pieces;
    this.selectedPiece = undefined;
    const board = [];
    this.turn = turn;
    for (let row = 7; row >= 0; row--) {
      let arr: (Piece | undefined)[] = [];
      for (let column = 0; column < MAX_COLUMN; column++) {
        let found = undefined;
        for (const piece of pieces) {
          if (piece.column === column && piece.row === row) {
            found = piece;
            break;
          }
        }
        arr.push(found);
      }
      board.push(arr);
    }
    this.board = board;
  }

  isPieceSelected(piece: Piece) {
    if (!this.selectedPiece) return false;
    const { selectedPiece } = this;
    return (
      selectedPiece.column === piece.column && selectedPiece.row === piece.row
    );
  }

  async getProposition(piece: Piece) {
    const propositions: Position[] = await invoke("get_proposition", { piece });
    console.log(propositions, piece);
    this.propositions.set(makePositionId(piece), propositions);
    return propositions!;
  }

  isPiecePresent(pos: Position): boolean {
    const { row, column } = pos;
    if (row < 0 || column < 0) return false;
    else if (!(row < MAX_ROW && column < MAX_COLUMN)) return false;
    return !!this.board[makeCorrectRow(row)][column];
  }

  getBoard() {
    return Array.from(this.board);
  }

  isPieceTurn(piece: Piece): boolean {
    if (piece.white && this.turn === Turn.White) return true;
    else if (!piece.white && this.turn === Turn.Black) return true;
    return false;
  }

  async movePiece(piece: Piece, pos: Position): Promise<Boolean> {
    return await invoke("move_piece", { piece, pos })
      .then(() => {
        const { row, column } = piece;
        this.board[makeCorrectRow(pos.row)][pos.column] = piece;
        this.board[makeCorrectRow(row)][column] = undefined;
        piece.column = pos.column;
        piece.row = pos.row;
        return true;
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
  }

  getPieces(): Piece[] {
    const pieces = [];
    for (const row of this.board) {
      for (const piece of row) {
        if (piece) pieces.push(piece);
      }
    }
    return pieces;
  }

  swapTurn(): Turn {
    if (this.turn === Turn.White) return Turn.Black;
    return Turn.White;
  }
}
