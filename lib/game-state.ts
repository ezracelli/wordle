export const GAME_STATE_VARIANT_IN_PROGRESS = "GameState::InProgress";
export const GAME_STATE_VARIANT_LOST = "GameState::Lost";
export const GAME_STATE_VARIANT_WON = "GameState::Won";

export interface InProgress {
    variant: typeof GAME_STATE_VARIANT_IN_PROGRESS;
}

export interface Lost {
    variant: typeof GAME_STATE_VARIANT_LOST;
}

export interface Won {
    variant: typeof GAME_STATE_VARIANT_WON;
}

export type GameState = InProgress | Lost | Won;

export const GameState = Object.freeze({
    InProgress: (): GameState => ({ variant: GAME_STATE_VARIANT_IN_PROGRESS }),
    Lost: (): GameState => ({ variant: GAME_STATE_VARIANT_LOST }),
    Won: (): GameState => ({ variant: GAME_STATE_VARIANT_WON }),
});
