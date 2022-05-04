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
import { CircularProgress } from "@mui/material";

import { ConversationRowType, UserType } from "../../type";
import ListNameWithAvatar from "../../ListNameWithAvatar";
import ChatMsg from "./ChatMsg";
import { BASE_URL } from "../../constant";
import { useScroll } from "../../hooks";

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

  const [{ data: messagesResponse, loading: isLoadingMsg, error: getError }] =
    useAxios({
      url: `${BASE_URL}/api/account/${account?.id}/conversation/${conversation?.id}/messages`,
    });

  const [
    { data: loadMoreResponse, loading: isLoadingMore, error: errorLoadMore },
    excuteLoadmore,
  ] = useAxios(
    {
      url: `${BASE_URL}/api/account/${account?.id}/conversation/${conversation?.id}/messages`,
    },
    { manual: true }
  );

  const [messagesData, setMessages] = React.useState([]);
  const [inputMessage, setInputMessage] = React.useState<string>("");
  const [
    { data: sendMessageData, loading: isSending, error: sendError },
    executePostMessage,
  ] = useAxios(
    {
      url: `${BASE_URL}/api/account/${account?.id}/conversation/${conversation?.id}/messages`,
      method: "POST",
    },
    { manual: true }
  );

  const sendMessage = () => {
    executePostMessage({
      data: {
        text: inputMessage,
      },
    });
    setInputMessage("");
  };

  const { containerCallbackRef, sentryCallbackRef } = useScroll({
    onLoadMore: () => {
      if (!isLoadingMore && !isLoadingMsg && messagesResponse != null) {
        excuteLoadmore({
          params: {
            cursor: prevCursor,
          },
        });
      }
    },
  });

  React.useEffect(() => {
    setMessages([]);
    setPrevCursor(null);
  }, [conversation]);

  React.useEffect(() => {
    if (
      messagesResponse != null &&
      isLoadingMsg === false &&
      getError == null
    ) {
      setMessages(messagesResponse.rows);
      setPrevCursor(messagesResponse.cursor_prev);
    }
  }, [messagesResponse, isLoadingMsg, getError]);

  React.useEffect(() => {
    if (
      loadMoreResponse != null &&
      isLoadingMore === false &&
      errorLoadMore == null
    ) {
      setMessages((oldMesg) => [...oldMesg, ...loadMoreResponse.rows]);
      setPrevCursor(loadMoreResponse.cursor_prev);
    }
  }, [loadMoreResponse, isLoadingMore, errorLoadMore]);

  React.useEffect(() => {
    if (sendMessageData != null && isSending === false && sendError == null) {
      setMessages((oldMesg) => [sendMessageData, ...oldMesg]);
    }
  }, [sendMessageData, isSending, sendError]);

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
        <Box
          sx={{
            width: "100%",
            height: "70vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
            marginBottom: 2,
          }}
          ref={containerCallbackRef}
        >
          {messagesData.map((message) => {
            return (
              <ChatMsg
                avatar={message?.sender.name}
                messages={[message?.text]}
                side={account.id === message.sender.id ? "right" : "left"}
                key={message.id}
              />
            );
          })}
          {prevCursor != null && (
            <Box>
              <CircularProgress ref={sentryCallbackRef} />
            </Box>
          )}
        </Box>
        <Grid container>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              multiline
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
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
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              onClick={sendMessage}
              disabled={isSending}
            >
              <SendIcon />
            </Fab>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CurrentConversation;
