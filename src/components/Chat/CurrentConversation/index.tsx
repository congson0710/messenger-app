import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import { ConversationRowType, UserType } from "../../type";
import ListNameWithAvatar from "../../ListNameWithAvatar";

const CurrentConversation = ({
  currentUser,
  conversation
}: {
  currentUser: UserType | null;
  conversation: ConversationRowType | null;
}) => {
  if (!conversation) {
    return <div>Please select a conversation</div>
  }

  const recipientName = conversation.participants[0].name;

  return (
    <Card>
      <CardHeader
        avatar={
          <ListNameWithAvatar name={recipientName} />
        }
        title={recipientName}
      />
    </Card>
  )
  // return <div>{conversation.participants.map(participant => participant.name).join(', ')}</div>;
};

export default CurrentConversation;
