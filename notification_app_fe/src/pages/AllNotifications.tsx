import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, ToggleButton, ToggleButtonGroup, CircularProgress } from "@mui/material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjg5MywiaWF0IjoxNzc3NzAxOTkzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNmUwOTFlNzItZmYzNy00Yzg2LTllMzktZmNmNzZlY2Q2MWFiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.2TbJvHWcdmCDFPOS7XLZJtAhBBXdlEMNpmEEdefTrFA";

const TYPE_COLORS: Record<string, "success" | "info" | "warning"> = {
  Placement: "success",
  Result: "info",
  Event: "warning"
};

export default function AllNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState("All");
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Log("frontend", "info", "page", "AllNotifications page loaded");
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      Log("frontend", "info", "api", "Fetching all notifications");
      const res = await fetch("/api/evaluation-service/notifications", {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await res.json();
      setNotifications(data.notifications);
      Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications`);
    } catch (e) {
      Log("frontend", "error", "api", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    setViewed(prev => new Set([...prev, id]));
    Log("frontend", "info", "component", `Notification ${id} marked as viewed`);
  };

  const filtered = filter === "All" ? notifications : notifications.filter(n => n.Type === filter);

  return (
    <Box>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_, v) => { if (v) { setFilter(v); Log("frontend", "info", "component", `Filter changed to ${v}`); }}}
        sx={{ mb: 3 }}
      >
        {["All", "Placement", "Result", "Event"].map(f => (
          <ToggleButton key={f} value={f} sx={{ color: "#aaa", "&.Mui-selected": { bgcolor: "#7c3aed", color: "white" } }}>
            {f}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#7c3aed" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map(n => (
            <Card
              key={n.ID}
              onClick={() => handleView(n.ID)}
              sx={{
                bgcolor: viewed.has(n.ID) ? "#1a1a2e" : "#2d1b69",
                border: viewed.has(n.ID) ? "1px solid #333" : "1px solid #7c3aed",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {!viewed.has(n.ID) && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#7c3aed" }} />}
                    <Typography sx={{ color: "white", fontWeight: viewed.has(n.ID) ? 400 : 700 }}>
                      {n.Message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: "#888" }}>
                    {new Date(n.Timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Chip label={n.Type} color={TYPE_COLORS[n.Type]} size="small" />
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}