import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useAxios from "axios-hooks";
import CircularProgress from "@mui/material/CircularProgress";

import { BASE_URL } from "../constant";
import { useSelectedUserContext } from "../../SelectedUserContext";
import RecentConversation from "./RecentConversation";
import CurrentConversation from "./CurrentConversation";
import { ConversationRowType } from "../type";

const Chat = ({
  conversation,
  setCurrentConversation,
} : {
  conversation: ConversationRowType | null,
  setCurrentConversation: (conversation: ConversationRowType | null) => void,
}) => {
  const { selectedUser: user } = useSelectedUserContext();
  const [{ data, loading: isLoading }] = useAxios({
    url: `${BASE_URL}/api/account/${user?.id}/conversations`,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <RecentConversation
            currentUser={user}
            data={data?.rows}
            setCurrentConversation={setCurrentConversation}
          />
        </Grid>
        <Grid item xs={8}>
          <CurrentConversation currentUser={user} conversation={conversation}/>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
