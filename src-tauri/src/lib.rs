#[derive(serde::Serialize, serde::Deserialize, Hash, PartialEq, Eq, Debug, Clone)]
pub struct Position {
    pub row: u8,
    pub column: u8,
}

impl From<libchess::piece::Position> for Position {
    fn from(value: libchess::piece::Position) -> Self {
        Self {
            row: value.row,
            column: value.column,
        }
    }
}

impl Into<libchess::piece::Position> for Position {
    fn into(self) -> libchess::piece::Position {
        libchess::piece::Position {
            row: self.row,
            column: self.column,
        }
    }
}

impl From<&libchess::piece::Piece> for Position {
    fn from(value: &libchess::piece::Piece) -> Self {
        Self {
            row: value.row,
            column: value.column,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Hash, Clone, Copy, Debug)]
pub enum Kind {
    Pawn,
    King,
    Queen,
    Bishop,
    Rook,
    Knight,
}

impl From<libchess::piece::Kind> for Kind {
    fn from(value: libchess::piece::Kind) -> Self {
        use libchess::piece::Kind as lkind;
        use Kind::*;
        match value {
            lkind::Bishop => Bishop,
            lkind::King => King,
            lkind::Pawn => Pawn,
            lkind::Knight => Knight,
            lkind::Queen => Queen,
            lkind::Rook => Rook,
        }
    }
}

impl Into<libchess::piece::Kind> for Kind {
    fn into(self) -> libchess::piece::Kind {
        use libchess::piece::Kind as lkind;
        use Kind::*;
        match self {
            Bishop => lkind::Bishop,
            King => lkind::King,
            Pawn => lkind::Pawn,
            Knight => lkind::Knight,
            Queen => lkind::Queen,
            Rook => lkind::Rook,
        }
    }
}

#[derive(serde::Serialize, serde::Deserialize, Hash, Clone, Debug)]
pub struct Piece {
    pub kind: Kind,
    pub row: u8,
    pub column: u8,
    pub white: bool,
}

impl Piece {
    pub fn from(value: libchess::piece::Piece, white: bool) -> Self {
        Self {
            kind: Kind::from(value.kind),
            row: value.row,
            column: value.column,
            white,
        }
    }
}

impl Into<libchess::piece::Piece> for Piece {
    fn into(self) -> libchess::piece::Piece {
        libchess::piece::Piece {
            row: self.row,
            column: self.column,
            kind: self.kind.into(),
        }
    }
}
