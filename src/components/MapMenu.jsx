import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Selections from "./Selections.jsx";
import Map from "../Charts/Map.jsx";
import Pyramid from "../Charts/Pyramid.jsx";
import { fetchFeature } from "../APIs/fetchFeature.js";
import { fetchPopulation } from "../APIs/fetchPopulation.js";
import geojson from "../assets/ChofuData/Chofu-Polygons.geo.json";

const drawerWidth = 240;

export default function MapMenu() {
    const years = ["2021", "2020", "2019", "2018", "2017"];
    const [year, setYear] = React.useState(years[0]);
    const [data, setData] = React.useState([]);
    const [town, setTown] = React.useState("市内全域");
    const [feature, setFeature] = React.useState([]);

    useEffect(() => {
        fetchPopulation(year).then((data) => {
            setData(data);
            fetchFeature(year).then((feat) => {
                setFeature(feat);
            });
        });
    }, [year]);

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
                    <Box
                        sx={{
                            width: "500px",
                        }}
                    >
                        <Grid
                            container
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
                                    width: "500px",
                                    pt: 2,
                                    maxWidth: "90vmin",
                                    maxHeight: "90vmin",
                                }}
                            >
                                <Map
                                    geojson={geojson}
                                    feature={feature}
                                    setName={setTown}
                                />
                            </Box>
                        </Grid>
                    </Box>
                    <Grid item xs="auto">
                        <Box
                            sx={{
                                width: "808px",
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
