import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";

import { BASE_URL } from "../../common/constants";
import { Conversation, User, Message } from "../../common/types";
import { useScroll, useFetch } from "../../hooks";

interface MessageInputProps {
  conversation: Conversation;
  user: User;
  onComplete?: () => void;
}

const MessageInput = ({
  conversation,
  user,
  onComplete: externalOnComplete,
}: MessageInputProps) => {
  const [value, setValue] = useState("");
  const {
    fetcher: postMessage,
    data: postMessageData,
    isLoading,
  } = useFetch<Message>({
    endpoint: `${BASE_URL}/api/account/${user.id}/conversation/${conversation.id}/messages`,
    method: "POST",
    onComplete: () => {
      setValue("");
      externalOnComplete?.();
    },
  });

  return (
    <Grid container>
      <Grid item xs={11}>
        <TextField
          id="outlined-basic-email"
          label="Type Something"
          fullWidth
          multiline
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
        />
      </Grid>
      <Grid item xs={1}>
        <Fab
          color="primary"
          aria-label="add"
          size="small"
          onClick={() => postMessage({ params: { text: value } })}
        >
          {isLoading ? <CircularProgress /> : <SendIcon />}
        </Fab>
      </Grid>
    </Grid>
  );
};

export default MessageInput;
