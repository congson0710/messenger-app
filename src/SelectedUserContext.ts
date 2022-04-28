import { createContext, useContext } from "react";
import { UserType } from "./components/type";

interface IContextProps {
  selectedUser: UserType | null;
  setSelectedUser: (user: UserType | null) => void;
}

const SelectedUserContext = createContext({} as IContextProps);

export const useSelectedUserContext = () => useContext(SelectedUserContext);

export default SelectedUserContext;
