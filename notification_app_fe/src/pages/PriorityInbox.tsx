import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Chip, CircularProgress, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { Log } from "../logger";

interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuazE1NzNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNDUzMSwiaWF0IjoxNzc3NzAzNjMxLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDRjOWY4NTUtY2JlYy00YTIzLTk5MDMtYjg5OGRlMzk3ZjZlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoibml5YXRpIiwic3ViIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0In0sImVtYWlsIjoibmsxNTczQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoibml5YXRpIiwicm9sbE5vIjoicmEyMzExMDU2MDMwMTE5IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMDBkYzVhNDctODljMy00ZGI2LTk2MDctYzFiNjY0Yjk2MzE0IiwiY2xpZW50U2VjcmV0Ijoid2ZCUVJGakNGVnJBenh0RCJ9.aB3Qhsx7tKwa5DNuPiosrTfutKveVReW4pzV7Sro4Zs";
const PRIORITY: Record<string, number> = { Placement: 3, Result: 2, Event: 1 };

const TYPE_COLORS: Record<string, "success" | "info" | "warning"> = {
  Placement: "success",
  Result: "info",
  Event: "warning"
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
      const sorted = [...data.notifications].sort((a, b) => {
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

  const topNotifications = notifications.slice(0, topN);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ color: "#7c3aed", fontWeight: 700 }}>
          🏆 Top Priority Notifications
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "#aaa" }}>Show Top</InputLabel>
          <Select
            value={topN}
            label="Show Top"
            onChange={(e) => {
              setTopN(Number(e.target.value));
              Log("frontend", "info", "component", `Top N changed to ${e.target.value}`);
            }}
            sx={{ color: "white", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#7c3aed" } }}
          >
            {[5, 10, 15, 20].map(n => (
              <MenuItem key={n} value={n}>Top {n}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#7c3aed" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {topNotifications.map((n, i) => (
            <Card
              key={n.ID}
              sx={{
                bgcolor: "#1a1a2e",
                border: "1px solid #7c3aed",
                transition: "all 0.2s",
                "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }
              }}
            >
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6" sx={{ color: "#7c3aed", minWidth: 40 }}>
                    {i < 3 ? MEDALS[i] : `#${i + 1}`}
                  </Typography>
                  <Box>
                    <Typography sx={{ color: "white", fontWeight: 600 }}>
                      {n.Message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {new Date(n.Timestamp).toLocaleString()}
                    </Typography>
                  </Box>
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