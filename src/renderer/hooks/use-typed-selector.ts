import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'renderer/state';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
