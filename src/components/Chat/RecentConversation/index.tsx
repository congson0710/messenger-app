import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import ListNameWithAvatar from "../../ListNameWithAvatar";
import Header from "./Header";
import { useScroll } from "../../hooks";
import { UserType, ConversationRowType } from "../../type";

const RecentConversation = ({
  currentUser,
  data = [],
  setConversation,
}: {
  currentUser: UserType | null;
  data: ConversationRowType[];
  setConversation: (user: ConversationRowType | null) => void;
}) => {
  const { containerCallbackRef, sentryCallbackRef } = useScroll({
    onLoadMore: () => {
      console.log("load more");
    },
  });
  const [searchText, setSearchText] = React.useState<string>("");
  const searchedData = React.useMemo(() => {
    const normalizeData = data.map((item) => {
      return {
        ...item,
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
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Header onSearchText={setSearchText} />
      <List
        ref={containerCallbackRef}
        sx={{ width: "100%", bgcolor: "background.paper" }}
      >
        <CircularProgress ref={sentryCallbackRef} />
        {searchedData?.map((conversation) => {
          return (
            <ListItem
              key={conversation.id}
              disablePadding
              onClick={() => setConversation(conversation)}
            >
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
    </Card>
  );
};

export default RecentConversation;
