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
                    <Grid item xs={12} md={5}>
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
                                    width: "100%",
                                    pt: 1,
                                    maxWidth: { xs: "100%", md: "min(500px, calc((100vh - 180px) / 0.9))" },
                                    maxHeight: { xs: "none", md: "calc(100vh - 180px)" },
                                }}
                            >
                                <Map
                                    geojson={geojson}
                                    feature={feature}
                                    setName={setTown}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box
                            sx={{
                                width: "100%",
                                maxWidth: { xs: "100%", md: "min(808px, calc((100vh - 100px) / 0.9))" },
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
