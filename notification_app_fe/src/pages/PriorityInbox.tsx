import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, CircularProgress, Select, MenuItem, FormControl, Avatar } from "@mui/material";
import { Work, EmojiEvents, School } from "@mui/icons-material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjcxMSwiaWF0IjoxNzc3NzA1ODExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZGEwNzg1MzMtYzM5NC00MGM5LWJhOTUtMmMzZTEzODFlZDY3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.MbqxHE8UtDGbVcvY3zxGvnYQyMi0yQ4O37QqFYjEfEQ";
const PRIORITY: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

const TYPE_CONFIG = {
  Placement: { color: "#10b981", bg: "#ecfdf5", icon: <Work sx={{ fontSize: 20 }} />, label: "Placement" },
  Result: { color: "#3b82f6", bg: "#eff6ff", icon: <School sx={{ fontSize: 20 }} />, label: "Result" },
  Event: { color: "#f59e0b", bg: "#fffbeb", icon: <EmojiEvents sx={{ fontSize: 20 }} />, label: "Event" },
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [topN, setTopN] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Log("frontend", "info", "page", "PriorityInbox page loaded");
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      Log("frontend", "info", "api", "Fetching notifications for priority inbox");
      const res = await fetch("/api/evaluation-service/notifications", {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      const data = await res.json();
      const sorted = [...(data.notifications || [])].sort((a, b) => {
        if (PRIORITY[b.Type] !== PRIORITY[a.Type]) return PRIORITY[b.Type] - PRIORITY[a.Type];
        return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
      });
      setNotifications(sorted);
      Log("frontend", "info", "utils", `Sorted ${sorted.length} notifications by priority`);
    } catch (e) {
      Log("frontend", "error", "api", "Failed to fetch notifications for priority inbox");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
          Priority Inbox
        </Typography>
        <FormControl size="small">
          <Select
            value={topN}
            onChange={(e) => { setTopN(Number(e.target.value)); Log("frontend", "info", "component", `TopN: ${e.target.value}`); }}
            sx={{ borderRadius: 2, minWidth: 120, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#764ba2" } }}
          >
            {[5, 10, 15, 20].map(n => (
              <MenuItem key={n} value={n}>Top {n}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#764ba2" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {notifications.slice(0, topN).map((n, i) => {
            const config = TYPE_CONFIG[n.Type];
            return (
              <Card
                key={n.ID}
                sx={{
                  borderRadius: 3,
                  border: `1px solid ${config.color}40`,
                  boxShadow: `0 2px 12px ${config.color}20`,
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 30px ${config.color}40` }
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h5" sx={{ minWidth: 40, textAlign: "center" }}>
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </Typography>
                  <Avatar sx={{ bgcolor: config.bg, color: config.color }}>
                    {config.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: "#1a1a2e" }}>
                      {n.Message}
                    </Typography>
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