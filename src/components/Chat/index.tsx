import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useAxios from "axios-hooks";
import CircularProgress from "@mui/material/CircularProgress";

import { BASE_URL } from "../constant";
import { useSelectedUserContext } from "../../SelectedUserContext";
import RecentConversation from "./RecentConversation";
import CurrentConversation from "./CurrentConversation";
import { ConversationRowType } from "../type";

const Chat = () => {
  const { selectedUser: user } = useSelectedUserContext();
  const [conversation, setConversation] = useState<ConversationRowType | null>(
    null
  );
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
  }, [setConversation, isLoading, data]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <RecentConversation
            currentUser={user}
            data={data?.rows}
            setConversation={setConversation}
          />
        </Grid>
        <Grid item xs={8}>
          <CurrentConversation
            data={data?.rows}
            conversation={conversation}
            account={user}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
