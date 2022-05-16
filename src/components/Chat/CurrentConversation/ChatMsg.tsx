import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Typography, Grid } from "@mui/material";
import withStyles from "@mui/styles/withStyles";

import { Message } from "../../common/types";
import defaultChatMsgStyles from "./defaultChatMsg.styles";
import ListNameWithAvatar from "../../common/components/ListNameWithAvatar";

const ChatMsg = ({
  classes,
  avatar,
  messages,
  side,
  GridContainerProps,
  GridItemProps,
  AvatarProps,
  getTypographyProps = () => {},
}) => {
  const attachClass = (index: number) => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === messages.length - 1) {
      return classes[`${side}Last`];
    }
    return "";
  };

  return (
    <Grid
      container
      spacing={1}
      justify={side === "right" ? "flex-end" : "flex-start"}
      {...GridContainerProps}
    >
      {side === "left" && (
        <Grid item xs={1} {...GridItemProps}>
          <ListNameWithAvatar
            name={avatar}
            className={cx(classes.avatar, AvatarProps.className)}
            style={{ fontSize: 14 }}
          />
        </Grid>
      )}
      <Grid
        item
        xs={11}
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messages.map((msg: Message, i: number) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={msg?.id || i} className={classes[`${side}Row`]}>
              <Typography
                align={side}
                className={cx(classes.msg, classes[side], attachClass(i))}
                paragraph
              >
                <p>{msg}</p>
              </Typography>
            </div>
          );
        })}
      </Grid>
      {side === "right" && (
        <Grid item xs={1} {...GridItemProps}>
          <ListNameWithAvatar
            name={avatar}
            className={cx(classes.avatar, AvatarProps.className)}
            style={{ fontSize: 14 }}
          />
        </Grid>
      )}
    </Grid>
  );
};

ChatMsg.propTypes = {
  avatar: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(["left", "right"]),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
};

ChatMsg.defaultProps = {
  avatar: "",
  messages: [],
  side: "left",
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
};

const enhance = withStyles(defaultChatMsgStyles, { name: "ChatMsg" });

export default enhance(ChatMsg);
