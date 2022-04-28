import React from "react";

import Accounts from "./components/Accounts";
import Chat from "./components/Chat";
import { UserType } from "./components/type";
import SelectedUserContext from "./SelectedUserContext";

const App = () => {
  const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null);

  return (
    <SelectedUserContext.Provider value={{ selectedUser, setSelectedUser }}>
      <div className="App">
        {selectedUser == null ? <Accounts /> : <Chat />}
      </div>
    </SelectedUserContext.Provider>
  );
};

export default App;