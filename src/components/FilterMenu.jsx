import * as React from "react";
import { useEffect } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Selections from "./Selections.jsx";
import Pyramid from "../Charts/Pyramid.jsx";
import { fetchPopulation } from "../APIs/fetchPopulation.js";

export default function FilterMenu() {
  const years = ["2021", "2020", "2019", "2018", "2017"];
  const [year, setYear] = React.useState(years[0]);
  const [data, setData] = React.useState([]);
  const [townList, setTownList] = React.useState([]);
  const [town, setTown] = React.useState("市内全域");
  useEffect(() => {
    fetchPopulation(year).then((data) => {
      setData(data);
    });
  }, [year]);

  useEffect(() => {
    setTownList(data.map((item) => item.town));
  }, [data]);

  return (
    <div className="App">
      <Box
        sx={{
          width: "100vw",
        }}
      >
        <Grid
          container
          spacing={10}
          sx={{ p: 2 }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs="auto">
            <Stack spacing={2}>
              <Selections
                options={years}
                value={year}
                setValue={setYear}
                label="Select Year"
              />
              <Selections
                options={townList}
                value={town}
                setValue={setTown}
                label="Select Town"
              />
            </Stack>
          </Grid>
          <Grid item xs="auto">
            <Box
              sx={{
                width: "90vw",
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
