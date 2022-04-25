import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import useAxios from "axios-hooks";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import ListNameWithAvatar from "./ListNameWithAvatar";
import { BASE_URL } from "./constant";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { useSelectedUserContext } from "../SelectedUserContext";

const Accounts = () => {
  const { setSelectedUser } = useSelectedUserContext();
  const [{ data, loading: isLoading }] = useAxios({
    url: `${BASE_URL}/api/accounts`,
  });

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
          {data?.map((account) => {
            const labelId = `checkbox-list-secondary-label-${account.id}`;
            return (
              <ListItem key={account.id} disablePadding>
                <ListItemButton onClick={() => setSelectedUser(account)}>
                  <ListItemAvatar>
                    <ListNameWithAvatar name={account?.name} />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={account.name}
                    secondary={
                      account?.email ? (
                        <Typography variant="body2" color="text.primary">
                          {account?.email}
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
    </Box>
  );
};

export default Accounts;
