import React, { useEffect, useState } from "react";
import { ddEmployeeAPI } from "../../API";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Container } from "@mui/material";

const DetailCards = ({ totalEmployee ,totalAttendance}) => {
  const [selectedCard, setSelectedCard] = useState(0);
//   const [totalAttendance, setTotalAttendance] = useState(5);
  const totalPresentPercent = (totalAttendance / totalEmployee) * 100;
  const totalAbsentPercent = 100 - totalPresentPercent;
  const cards = [
    {
      id: 1,
      title: "Employees",
      description: "Since,2000",
      total: totalEmployee,
    },
    {
      id: 2,
      title: "Total Attendance",
      description: "Total number of employees present today.",
      total: totalAttendance,
    },
    {
      id: 3,
      title: "Total Present %",
      description: "Total percentage of present employee.",
      total: totalPresentPercent,
    },
    {
      id: 4,
      title: "Total Absent %",
      description: "Total percentage of absent employee.",
      total: totalAbsentPercent,
    },
  ];

  return (
    <>
      <Container maxWidth="fixed">
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {cards.map((card, index) => {
            // Pick a color based on index
            const colors = ["#1976d2", "#388e3c", "#f57c00", "#d32f2f"]; // blue, green, orange, red
            const badgeColor = colors[index % colors.length];

            return (
              <Card key={index} sx={{ position: "relative" }}>
                {/* Number badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: badgeColor,
                    color: "white",
                    borderRadius: "50%",
                    width: 37,
                    height: 37,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {card.total}
                </Box>

                <CardActionArea
                  onClick={() => setSelectedCard(index)}
                  data-active={selectedCard === index ? "" : undefined}
                  sx={{
                    height: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardContent sx={{ height: "100%" }}>
                    <Typography variant="h5" component="div">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      </Container>
    </>
  );
};

export default DetailCards;
