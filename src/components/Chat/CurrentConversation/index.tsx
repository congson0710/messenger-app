import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import AvatarGroup from "@mui/material/AvatarGroup";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import useAxios from "axios-hooks";
import SendIcon from "@mui/icons-material/Send";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";

import { ConversationRowType, UserType } from "../../type";
import ListNameWithAvatar from "../../ListNameWithAvatar";
import ChatMsg from "./ChatMsg";
import { BASE_URL } from "../../constant";

const normalizeData = (rawResponse) => {
  if (rawResponse == null) {
    return [];
  }

  const data = rawResponse?.rows.reduce((acc, curr) => {
    const lastItem = acc.slice(-1).length > 0 ? acc.slice(-1)[0] : null;

    if (lastItem?.sender.id === curr?.sender.id) {
      const newCurr = {
        ...curr,
        text: [...lastItem?.text, curr.text],
      };
      return [...acc.slice(0, -1), newCurr];
    } else {
      const newCurr = {
        ...curr,
        text: [curr?.text],
      };
      return [...acc, newCurr];
    }
  }, []);

  return data;
};

const CurrentConversation = ({
  conversation,
  data,
  account,
}: {
  conversation: ConversationRowType | null;
  data: ConversationRowType[];
  account: UserType | null;
}) => {
  const participants =
    data.find((p: ConversationRowType) => p.id === conversation?.id)
      ?.participants ?? [];

  const cardTitle = participants
    .map((p: UserType) => p.name)
    .filter(Boolean)
    .join(", ");

  const [prevCursor, setPrevCursor] = React.useState<string | null>(null);

  const [{ data: messagesResponse }] = useAxios({
    url: `${BASE_URL}/api/account/${account?.id}/conversation/${
      conversation?.id
    }/messages${prevCursor !== null ? `?cursor=${prevCursor}` : ""}`,
  });

  const messagesData = normalizeData(messagesResponse);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <CardHeader
        sx={{ textAlign: "left" }}
        avatar={
          <AvatarGroup max={2}>
            {participants.map((item) => {
              return <ListNameWithAvatar key={item.id} name={item?.name} />;
            })}
          </AvatarGroup>
        }
        title={`conversation between ${cardTitle}`}
      />
      <Divider />
      <CardContent>
        <Box sx={{ width: "100%", height: "80vh" }}>
          {messagesData.map((message) => {
            return (
              <ChatMsg
                avatar={message?.sender.name}
                messages={message?.text}
                side={account.id === message.sender.id ? "right" : "left"}
              />
            );
          })}
        </Box>
        <Grid container>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid
            item
            xs={1}
            direction="row"
            alignItems="center"
            justify="flex-end"
          >
            <Fab color="primary" aria-label="add" size="small">
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrentConversation;
