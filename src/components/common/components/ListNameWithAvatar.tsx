import React from "react";
import Avatar from "@mui/material/Avatar";

type SxProps = {
  bgcolor: string;
};

type StringColorType = {
  children: string;
  sx: SxProps;
};

const stringToColor = (string: string): string => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string): StringColorType => {
  const firstCharacter = name.split(" ")?.[0]?.[0];
  const secondCharacter = name.split(" ")?.[1]?.[0];

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: [firstCharacter, secondCharacter].filter(Boolean).join(""),
  };
};

const ListNameWithAvatar = ({
  name = "",
  className,
  style,
}: {
  name?: string | undefined;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return <Avatar {...stringAvatar(name)} className={className} style={style} />;
};

export default ListNameWithAvatar;
