import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import * as d3 from "d3";

function Tooltip(props) {
    const { pos, data, toolCat, pyramidSize } = props;

    if (data === null || toolCat === null) return null;

    const tooltipStyle = {
        position: "absolute",
    };

    if (toolCat.gender === "female") {
        tooltipStyle.left = pos.x - 370;
    } else {
        tooltipStyle.left = pos.x + 10;
    }

    if (["0-4", "5-9", "10-14", "15-19", "20-24"].includes(toolCat.ageGroup)) {
        tooltipStyle.top = pos.y - 260;
    } else {
        tooltipStyle.top = pos.y + 10;
    }

    return (
        <div style={tooltipStyle}>
            <Card sx={{ width: 360 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {`${toolCat.gender === "male" ? "男性: " : "女性: "}${
                            toolCat.ageGroup === "100+"
                                ? "100歳以上"
                                : `${toolCat.ageGroup.replace("-", "~")}歳`
                        }`}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                        男性の人口
                    </Typography> */}
                </CardContent>
                <CardActionArea>
                    <CardActions>
                        <InfoTable data={data} categories={toolCat} />
                    </CardActions>
                </CardActionArea>
            </Card>
        </div>
    );
}

function InfoTable(props) {
    const { data, categories } = props;
    function createData(label, value) {
        return { label, value };
    }

    const townList = data.map((item) => item.town);

    const populationData = data.filter(
        (item) => item.town === categories.town
    )[0].data;

    const populationSum = populationData
        .map((e) => [e.male, e.female])
        .flat()
        .reduce((sum, element) => sum + element, 0);

    const townPopulation = populationData.filter(
        (item) => item.ageGroup === categories.ageGroup
    )[0][categories.gender];

    const rows = [
        createData(
            "人数(人)",
            populationData.filter(
                (item) => item.ageGroup === categories.ageGroup
            )[0][categories.gender]
        ),
        createData(
            "割合(%)",
            d3.format(".4f")((townPopulation / populationSum) * 100)
        ),
    ];
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>種類</TableCell>
                        <TableCell align="right">値</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.label}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {row.label}
                            </TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Tooltip;
