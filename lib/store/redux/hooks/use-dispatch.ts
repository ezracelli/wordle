import { Action, AnyAction, Dispatch } from "redux";

import { useStore } from ".";

export const useDispatch = <
    TAction extends Action = AnyAction,
>(): Dispatch<TAction> => useStore().dispatch;
