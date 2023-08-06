import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import type { Dispatch } from "redux";

export const useAppDispatch = (): Dispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
