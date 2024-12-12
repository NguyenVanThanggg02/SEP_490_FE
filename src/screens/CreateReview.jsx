import { Box, Button, Paper, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import StartRating from "./StartRating";

export default function CreateReview() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const onSetRating = (rating) => {
    setRating(rating);
  };

  const onSave = async () => {
    const userId = localStorage.getItem("userId");
  
    const data = {
      rating,
      spaceId,
      text,
      userId,
    };
  
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:9999/reviews", data);
      toast.success("Đánh giá thành công");
      setTimeout(() => {
        navigate(`/spaces/${spaceId}`);
      }, 2000);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        toast.warning(err.response.data.message);
      } else {
        toast.error("Đánh giá thất bại"); 
      }
    }
  };

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:9999/spaces/${spaceId}`);
        setSpaceData(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaceData();
  }, [spaceId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: "100%",
          padding: 4,
          borderRadius: 4,
          background: "#ffffff",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              color: "#212529",
              textAlign: "center",
              marginBottom: 1,
            }}
          >
            Đánh giá không gian
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6c757d",
              fontStyle: "italic",
              fontSize:'20px',
              textAlign: "center",
            }}
          >
            {loading ? "Đang tải thông tin..." : spaceData?.name || "Không gian không xác định"}
          </Typography>
          <StartRating averageRating={rating} onSetRating={onSetRating} />
          <TextField
            id="review"
            label="Nhập đánh giá của bạn"
            placeholder="Chia sẻ trải nghiệm của bạn..."
            multiline
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "#f8f9fa",
              },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0d6efd",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={onSave}
            disabled={loading}
            sx={{
              background: "linear-gradient(to right, #4caf50, #81c784)",
              color: "#fff",
              fontWeight: "bold",
              padding: "12px 20px",
              fontSize: "1rem",
              borderRadius: 2,
              textTransform: "none",
              width: "100%",
              "&:hover": {
                background: "linear-gradient(to right, #388e3c, #66bb6a)",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Nộp đánh giá"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
