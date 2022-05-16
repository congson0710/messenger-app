import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import useAxios from "axios-hooks";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import uniqBy from "lodash/fp/uniqBy";
import keys from "lodash/fp/keys";
import flatMap from "lodash/fp/flatMap";
import get from "lodash/fp/get";
import flow from "lodash/fp/flow";
import reverse from "lodash/fp/reverse";

import ChatMsg from "./ChatMsg";
import MessageInput from "../MessageInput";
import ListNameWithAvatar from "../../common/components/ListNameWithAvatar";
import { BASE_URL } from "../../common/constants";
import { useScroll, useFetch } from "../../hooks";
import { Conversation, Messages, Message, User } from "../../common/types";

const PAGE_SIZE = 20;

interface CurrentConversationProps {
  data: Conversation | null;
  currentUser: User;
}

const getTitle = (participants: User[]) =>
  participants
    .map((item: User) => item.name)
    .filter(Boolean)
    .join(", ");

const CurrentConversation: React.FC<CurrentConversationProps> = ({
  data,
  currentUser,
}) => {
  if (data == null) {
    return null;
  }

  const { participants } = data;
  const title = React.useMemo(() => getTitle(participants), [participants]);

  // API calls
  const {
    fetcher: fetchMessages,
    resetter: resetMessagesData,
    data: messagesData,
    paginatedData: paginatedMessagesData,
    isLoading: isFetchingMessages,
  } = useFetch<Messages>({
    endpoint: `${BASE_URL}/api/account/${currentUser.id}/conversation/${data.id}/messages`,
    method: "GET",
  });
  const ableToLoadMore = React.useMemo(() => {
    if (messagesData == null) return false;

    const { cursor_prev, rows } = messagesData;
    return !isFetchingMessages && cursor_prev != null && rows.length > 0;
  }, [messagesData, isFetchingMessages]);

  // calculate load more
  const onLoadMore = React.useCallback(() => {
    if (messagesData == null) return;

    const { sort, cursor_prev, cursor_next } = messagesData;
    if (ableToLoadMore) {
      fetchMessages({
        params: {
          pageSize: PAGE_SIZE,
          cursor: sort === "OLDEST_FIRST" ? cursor_next : cursor_prev,
        },
        withPagination: true,
      });
    }
  }, [messagesData, isFetchingMessages, ableToLoadMore]);

  // handle scrolling
  const { containerCallbackRef, sentryCallbackRef } = useScroll({
    onLoadMore,
  });

  const messages = React.useMemo(() => {
    const sorted = paginatedMessagesData.map((item) =>
      item.sort === "OLDEST_FIRST" ? { ...item, rows: [...item.rows] } : item
    );

    return flow(flatMap("rows"), uniqBy("id"))(sorted);
  }, [paginatedMessagesData]);

  React.useEffect(() => {
    fetchMessages({
      params: {
        pageSize: PAGE_SIZE,
      },
      withPagination: true,
    });

    return () => resetMessagesData();
  }, [data]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        sx={{ textAlign: "left" }}
        avatar={
          <AvatarGroup max={2}>
            {participants.map((item: User) => {
              return <ListNameWithAvatar key={item.id} name={item?.name} />;
            })}
          </AvatarGroup>
        }
        title={`conversation between ${title}`}
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            width: "100%",
            height: "70vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
          ref={containerCallbackRef}
        >
          {paginatedMessagesData != null &&
          paginatedMessagesData.length === 0 &&
          isFetchingMessages ? (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress ref={sentryCallbackRef} />
            </Box>
          ) : (
            <>
              {messages.map((message: Message) => (
                <ChatMsg
                  key={message.id}
                  avatar={message.sender.name}
                  messages={[message.text]}
                  side={currentUser.id === message.sender.id ? "right" : "left"}
                />
              ))}
              {ableToLoadMore && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress ref={sentryCallbackRef} />
                </Box>
              )}
            </>
          )}
        </Box>
        <MessageInput
          user={currentUser}
          conversation={data}
          onComplete={() => {
            fetchMessages({
              params: {
                pageSize: PAGE_SIZE,
              },
              withPagination: true,
            });
          }}
        />
      </CardContent>
    </Card>
  );
};

export default CurrentConversation;
