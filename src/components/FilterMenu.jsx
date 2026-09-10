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
                    width: "100%",
                    px: { xs: 1, sm: 2 },
                    py: { xs: 1, sm: 1 },
                    overflowX: "hidden",
                }}
            >
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={12} md="auto">
                        <Stack spacing={2} alignItems="center">
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
                    <Grid item xs={12} md="auto">
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: { xs: "100%", md: "min(800px, calc((100vh - 100px) / 0.9))" },
                                maxHeight: { xs: "none", md: "calc(100vh - 100px)" },
                                margin: "0 auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
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
