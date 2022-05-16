import React, { useEffect, useCallback } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import { useSelectedUserContext } from "../../SelectedUserContext";
import ListNameWithAvatar from "../common/components/ListNameWithAvatar";
import { BASE_URL } from "../common/constants";
import { User } from "../common/types";
import { useFetch, useScroll } from "../hooks";

const Accounts = () => {
  const { setSelectedUser } = useSelectedUserContext();
  const {
    fetcher: fetchAccounts,
    data,
    isLoading,
  } = useFetch<Array<User>>({
    endpoint: `${BASE_URL}/api/accounts`,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography gutterBottom variant="h4">
        Select an Account
      </Typography>
      <Paper variant="outlined" sx={{ width: 450, pt: 1, pb: 1 }}>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {data?.map((account: User) => {
            const labelId = `checkbox-list-secondary-label-${account.id}`;

            return (
              <ListItem key={account.id} disablePadding>
                <ListItemButton onClick={() => setSelectedUser(account)}>
                  <ListItemAvatar>
                    <ListNameWithAvatar name={account.name} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={account.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
};

export default Accounts;
