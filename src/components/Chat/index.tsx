import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useAxios from "axios-hooks";
import CircularProgress from "@mui/material/CircularProgress";

import { useSelectedUserContext } from "../../SelectedUserContext";
import Conversations from "./Conversations";
import CurrentConversation from "./CurrentConversation";
import { BASE_URL } from "../common/constants";
import { Conversation } from "../common/types";

const Chat = () => {
  const { selectedUser: user } = useSelectedUserContext();
  const [conversation, setConversation] = useState<Conversation | null>(null);

  if (user == null) {
    return <div>Select a user</div>;
  }

  const [{ data, loading: isLoading }] = useAxios({
    url: `${BASE_URL}/api/account/${user?.id}/conversations`,
  });

  useEffect(() => {
    if (!isLoading && data != null && data?.rows.length > 0) {
      setConversation(data?.rows[0]);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Conversations
            data={data?.rows}
            currentUser={user}
            setConversation={setConversation}
          />
        </Grid>
        <Grid item xs={8}>
          <CurrentConversation data={conversation} currentUser={user} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
