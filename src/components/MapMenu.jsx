import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Selections from "./Selections.jsx";
import Map from "../Charts/Map.jsx";
import Pyramid from "../Charts/Pyramid.jsx";
import { fetchPopulation } from "../APIs/fetchPopulation.js";
import geojson from "../assets/ChofuData/Chofu-Polygons.geo.json";
import CssBaseline from "@mui/material/CssBaseline";

const drawerWidth = 240;

export default function MapMenu() {
  const years = ["2021", "2020", "2019", "2018", "2017"];
  const [year, setYear] = React.useState(years[0]);
  const [data, setData] = React.useState([]);
  const [townList, setTownList] = React.useState([]);
  const [town, setTown] = React.useState("市内全域");
  const [mouse, setMouse] = React.useState("市内全域");

  useEffect(() => {
    fetchPopulation(year).then((data) => {
      setData(data);
      console.log(data);
    });
  }, [year]);

  useEffect(() => {
    setTownList(data.map((item) => item.town));
  }, [data]);

  useEffect(() => {
    if (townList.includes(mouse)) {
      setTown(mouse);
    }
  }, [mouse]);

  return (
    <div className="App">
      <Box>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs="auto">
            <Stack spacing={2} justifyContent="center" alignItems="center">
              <Selections
                options={years}
                value={year}
                setValue={setYear}
                label="Select Year"
              />
              <Container
                maxWidth="ms"
                justifyContent="center"
                alignItems="center"
              >
                <Box
                  sx={{
                    width: "50vh",
                    height: "50vh",
                  }}
                >
                  <Map geojson={geojson} setName={setMouse} />
                </Box>
              </Container>
            </Stack>
          </Grid>
          <Grid item xs="auto">
            <Container
              maxWidth="ms"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{
                  width: "80vh",
                  height: "80vh",
                }}
              >
                <Pyramid town={town} data={data} />
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </div>
  );

  // return (
  //   <React.Fragment>
  //     <CssBaseline />
  //     <Container fixed maxWidth="sm">
  //       <Box
  //         sx={{
  //           width: 1000,
  //           height: 300,
  //           backgroundColor: "primary.dark",
  //           "&:hover": {
  //             backgroundColor: "primary.main",
  //             opacity: [0.9, 0.8, 0.7],
  //           },
  //         }}
  //       />
  //     </Container>
  //   </React.Fragment>
  // );
}
