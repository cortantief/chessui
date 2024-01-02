// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{collections::HashMap, sync::Mutex};

use chess_ui::{Kind, Piece, Position};
use libchess::game_manager::GameManager;

struct GameState {
    gm: Mutex<GameManager>,
}
// remember to call `.manage(MyState::default())`
#[tauri::command]
async fn new_game(state: tauri::State<'_, GameState>) -> Result<Vec<chess_ui::Piece>, String> {
    if let Ok(mut gm) = state.gm.lock() {
        let mut pieces = vec![];
        *gm = GameManager::new();
        for i in &gm.whites {
            pieces.push(Piece::from(i.clone(), true))
        }
        for i in &gm.blacks {
            pieces.push(Piece::from(i.clone(), false))
        }
        return Ok(pieces);
    }
    Err("Mutex locked".to_string())
}

#[tauri::command]
async fn get_proposition(
    state: tauri::State<'_, GameState>,
    piece: Piece,
) -> Result<Vec<chess_ui::Position>, String> {
    if let Ok(gm) = state.gm.lock() {
        let mut positions = vec![];
        let suggestions = gm.move_suggestion(&piece.clone().into());
        for position in suggestions {
            positions.push(position.into())
        }
        return Ok(positions);
    }
    Err("Mutex locked".to_string())
}

#[tauri::command]
async fn move_piece(
    state: tauri::State<'_, GameState>,
    piece: Piece,
    pos: Position,
) -> Result<(), String> {
    if let Ok(gm) = &mut state.gm.lock() {
        if let Err(err) = gm.move_piece(&piece.clone().into(), pos.clone().into()) {
            return Err("illegal move".to_string());
        }
        gm.swap_turn();
        return Ok(());
    }
    Err("Mutex locked".to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(GameState {
            gm: Mutex::new(GameManager::new()),
        })
        .invoke_handler(tauri::generate_handler![
            new_game,
            get_proposition,
            move_piece
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
