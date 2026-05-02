import { useState, useEffect } from "react";
import { Box, Tab, Tabs, Typography, Container } from "@mui/material";
import AllNotifications from "./pages/AllNotifications";
import PriorityInbox from "./pages/PriorityInbox";
import { Log } from "./logger";

function App() {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    Log("frontend", "info", "page", "App initialized");
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0f0f1a", color: "white" }}>
      <Box sx={{ bgcolor: "#1a1a2e", py: 2, px: 3, borderBottom: "1px solid #7c3aed" }}>
        <Typography variant="h5" sx={{ color: "#7c3aed", fontWeight: 700 }}>
          🔔 Campus Notifications
        </Typography>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => { setTab(v); Log("frontend", "info", "component", `Switched to tab ${v}`); }}
          sx={{ mb: 3, "& .MuiTab-root": { color: "#aaa" }, "& .Mui-selected": { color: "#7c3aed" }, "& .MuiTabs-indicator": { bgcolor: "#7c3aed" } }}
        >
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
        {tab === 0 && <AllNotifications />}
        {tab === 1 && <PriorityInbox />}
      </Container>
    </Box>
  );
}

export default App;