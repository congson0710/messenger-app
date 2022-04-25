import { createContext, useContext } from "react";

const SelectedUserContext = createContext({});

export const useSelectedUserContext = () => useContext(SelectedUserContext);

export default SelectedUserContext;
