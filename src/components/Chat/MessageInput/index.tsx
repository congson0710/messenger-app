import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";

const MessageInput = () => (
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
    <Grid item xs={1} direction="row" alignItems="center" justify="flex-end">
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
);

export default MessageInput;
