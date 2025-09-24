import React, { useEffect, useState } from "react";
import { ddEmployeeAPI } from "../../API";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Container } from "@mui/material";

const DetailCards = ({ data }) => {
  const [selectedCard, setSelectedCard] = useState(0);
  const cards = [
    {
      id: 1,
      title: "Employees",
      description: "Total number of Employees.",
      total: data?.totalEmployee,
    },
    {
      id: 2,
      title: "Total Attendance",
      description: "Total number of employees present today.",
      total: data?.totalPresentEmp,
    },
    {
      id: 3,
      title: "Total Present %",
      description: "Total percentage of present employee.",
      total: data?.totalPerPresentEmp,
    },
    {
      id: 4,
      title: "Total Absent %",
      description: "Total percentage of absent employee.",
      total: data?.totalPerAbsentEmp,
    },
  ];

  return (
    <>
      <Container maxWidth="fixed" sx={{ px: 4 }}>
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)", // mobile
              sm: "repeat(2, 1fr)", // tablets
              md: "repeat(2, 1fr)", // medium screens
              lg: "repeat(4, 1fr)", // screens above 1024px
            },
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
                  className="circle-box"
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
