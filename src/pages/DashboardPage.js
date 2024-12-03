import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import universityImg from "../assets/img/university.jpg";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  ":hover": {
    boxShadow: "0px 6px 32px 0px rgba(0, 0, 0, 0.2)",
  },
}));

const data = [
  {
    title: "Institutes",
    amount: 24,
    to: "/institute",
    img: universityImg,
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <Box py={2}>
      <Grid container spacing={2}>
        {data.map((item) => (
          <Grid item xs={6} md={4} lg={3} key={item.to}>
            <StyledCard onClick={() => navigate(item.to)}>
              <CardMedia
                sx={{ height: 140 }}
                image={item.img}
                title={item.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {item.title}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  We have <strong>{item.amount}</strong> educations
                </Typography> */}
              </CardContent>
              <CardActions>
                <Button variant="standard" onClick={() => navigate(item.to)}>
                  View
                </Button>
                {/* <Button size="small">Learn More</Button> */}
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
