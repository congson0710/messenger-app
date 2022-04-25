import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListNameWithAvatar from "../../ListNameWithAvatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Paper from "@mui/material/Paper";
import Header from "./Header";

const RecentConversation = ({ currentUser, data = [] }) => {
  const [searchText, setSearchText] = React.useState("");
  const searchedData = React.useMemo(() => {
    const normalizeData = data.map((item) => {
      return {
        id: item.id,
        participants: item.participants.filter((p) => p.id !== currentUser?.id),
      };
    });

    if (!searchText) {
      return normalizeData;
    }
    return normalizeData.filter((item) =>
      item.participants.some((p) =>
        p.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [data, searchText, currentUser?.id]);

  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Header onSearchText={setSearchText} />
        {searchedData?.map((conversation) => {
          return (
            <ListItem key={conversation.id} disablePadding>
              <ListItemButton>
                <ListItemAvatar sx={{ mr: 1 }}>
                  <AvatarGroup max={2}>
                    {conversation?.participants.map((item) => {
                      return (
                        <ListNameWithAvatar key={item.id} name={item?.name} />
                      );
                    })}
                  </AvatarGroup>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation?.participants
                    .map((item) => item.name)
                    .join(", ")}
                  secondary={
                    conversation?.lastMessage ? (
                      <Typography variant="body2" color="text.primary">
                        {`${conversation.lastMessage.sender.name}: ${conversation.lastMessage.text}`}
                      </Typography>
                    ) : null
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default RecentConversation;
