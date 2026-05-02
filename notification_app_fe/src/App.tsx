import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography, Container, Paper } from "@mui/material";
import { NotificationsActive } from "@mui/icons-material";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";
import { Log } from "./logger";

function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    Log("frontend", "info", "page", "App initialized");
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      {/* HEADER */}
      <Box sx={{
        textAlign: "center",
        py: 5,
        px: 4,
      }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 1 }}>
          <NotificationsActive sx={{ color: "white", fontSize: 40 }} />
          <Typography variant="h3" sx={{ color: "white", fontWeight: 800 }}>
            Campus Notifications
          </Typography>
        </Box>
        <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
          Stay updated with placements, results, and events
        </Typography>
      </Box>

      {/* MAIN CARD */}
      <Container maxWidth="md">
        <Paper elevation={0} sx={{
          borderRadius: 4,
          overflow: "hidden",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
        }}>
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); Log("frontend", "info", "component", `Tab ${v} selected`); }}
            sx={{
              px: 3,
              pt: 1,
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              "& .MuiTab-root": { color: "#888", fontWeight: 600, fontSize: 15 },
              "& .Mui-selected": { color: "#764ba2" },
              "& .MuiTabs-indicator": { bgcolor: "#764ba2", height: 3, borderRadius: 2 }
            }}
          >
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {tab === 0 && <AllNotifications />}
            {tab === 1 && <PriorityInbox />}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default App;