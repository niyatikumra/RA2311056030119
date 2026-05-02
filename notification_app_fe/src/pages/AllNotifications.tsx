import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, Button, CircularProgress, Avatar } from "@mui/material";
import { Notifications, Work, EmojiEvents, School } from "@mui/icons-material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjcxMSwiaWF0IjoxNzc3NzA1ODExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGEwNzg1MzMtYzM5NC00MGM5LWJhOTUtMmMzZTEzODFlZDY3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.MbqxHE8UtDGbVcvY3zxGvnYQyMi0yQ4O37QqFYjEfEQ";
const TYPE_CONFIG = {
  Placement: { color: "#10b981", bg: "#ecfdf5", icon: <Work sx={{ fontSize: 20 }} />, label: "Placement" },
  Result: { color: "#3b82f6", bg: "#eff6ff", icon: <School sx={{ fontSize: 20 }} />, label: "Result" },
  Event: { color: "#f59e0b", bg: "#fffbeb", icon: <EmojiEvents sx={{ fontSize: 20 }} />, label: "Event" },
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
      setNotifications(data.notifications || []);
      Log("frontend", "info", "api", `Fetched ${data.notifications.length} notifications`);
    } catch (e) {
      Log("frontend", "error", "api", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "All" ? notifications : notifications.filter(n => n.Type === filter);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#1a1a2e" }}>
        All Notifications
      </Typography>

      {/* FILTER BUTTONS */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {["All", "Placement", "Result", "Event"].map(f => (
          <Button
            key={f}
            onClick={() => { setFilter(f); Log("frontend", "info", "component", `Filter: ${f}`); }}
            variant={filter === f ? "contained" : "outlined"}
            size="small"
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              ...(filter === f ? {
                bgcolor: "#764ba2",
                "&:hover": { bgcolor: "#667eea" }
              } : {
                borderColor: "#764ba2",
                color: "#764ba2",
                "&:hover": { borderColor: "#667eea", color: "#667eea" }
              })
            }}
          >
            {f}
          </Button>
        ))}
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#764ba2" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map(n => {
            const config = TYPE_CONFIG[n.Type];
            const isViewed = viewed.has(n.ID);
            return (
              <Card
                key={n.ID}
                onClick={() => { setViewed(prev => new Set([...prev, n.ID])); Log("frontend", "info", "component", `Viewed: ${n.ID}`); }}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  border: isViewed ? "1px solid #e5e7eb" : `2px solid ${config.color}`,
                  boxShadow: isViewed ? "none" : `0 4px 20px ${config.color}30`,
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 30px ${config.color}40` },
                  opacity: isViewed ? 0.7 : 1
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: config.bg, color: config.color, width: 44, height: 44 }}>
                    {config.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      {!isViewed && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: config.color }} />}
                      <Typography sx={{ fontWeight: isViewed ? 400 : 700, color: "#1a1a2e" }}>
                        {n.Message}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {new Date(n.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{ bgcolor: config.bg, color: config.color, fontWeight: 600, borderRadius: 2 }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}