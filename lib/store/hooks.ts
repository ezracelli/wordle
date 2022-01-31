import { useDispatch, useSelector } from "./redux";

import type { TypedUseSelectorHook } from "./redux";

import type { Action, State } from ".";

export const useAppDispatch = () => useDispatch<Action>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
