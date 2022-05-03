import React from "react";
import { ConversationRowType, UserType } from "../../type";

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

  return <div>{conversation.participants.map(participant => participant.name).join(', ')}</div>;
};

export default CurrentConversation;
