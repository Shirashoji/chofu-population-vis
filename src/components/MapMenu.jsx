import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Selections from "./Selections.jsx";
import Map from "../Charts/Map.jsx";
import Pyramid from "../Charts/Pyramid.jsx";
import { fetchPopulation } from "../APIs/fetchPopulation.js";
import geojson from "../assets/ChofuData/Chofu-Polygons.geo.json";

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
      <Box
        sx={{
          width: "100vw",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{ p: 2 }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs="auto" justifyContent="center" alignItems="center">
            <Stack
              spacing={2}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Selections
                options={years}
                value={year}
                setValue={setYear}
                label="Select Year"
              />

              <Box
                sx={{
                  width: "150%",
                  maxWidth: "90vmin",
                  maxHeight: "90vmin",
                  // border: "1px dashed grey",
                }}
              >
                <Map geojson={geojson} setName={setMouse} />
              </Box>
            </Stack>
          </Grid>
          <Grid item xs="auto">
            <Box
              sx={{
                width: "100vw",
                maxWidth: "90vmin",
                maxHeight: "90vmin",
              }}
            >
              <Pyramid town={town} data={data} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
