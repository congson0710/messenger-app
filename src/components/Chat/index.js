import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import RecentConversation from "./RecentConversation";
import useAxios from "axios-hooks";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL } from "../constant";
import { useSelectedUserContext } from "../../SelectedUserContext";

const Chat = () => {
  const { selectedUser: user } = useSelectedUserContext();
  const [{ data, loading: isLoading }] = useAxios({
    url: `${BASE_URL}/api/account/${user.id}/conversations?pageSize=2`,
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <RecentConversation currentUser={user} data={data?.rows} />
        </Grid>
        <Grid item xs={8} />
      </Grid>
    </Container>
  );
};

export default Chat;
