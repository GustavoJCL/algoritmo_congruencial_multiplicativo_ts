// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command()]
fn run_rgn(seed: u64, k: u64, g: u64) -> Vec<f64> {
    let m: u64 = 2u64.pow(g as u32);
    let a: u64 = 5 + 8 * k;
    let mut xi: u64 = seed;
    let mut ri: Vec<f64> = Vec::new();
    for _i in 1..m / 4 {
        ri.push(xi as f64 / (m - 1) as f64);
        xi = (a * xi) % m;
    }
    ri.push(xi as f64 / (m - 1) as f64);
    ri
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![run_rgn])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
