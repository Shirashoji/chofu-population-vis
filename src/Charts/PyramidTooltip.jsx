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
import { useMemo } from "react";

const CURSOR_OFFSET = 10;
const TOOLTIP_WIDTH = 360;
const Y_OFFSET_TOP = 275;
const Y_OFFSET_BOTTOM = 200;

const YOUNG_AGE_GROUPS = [
    "0-4",
    "5-9",
    "10-14",
    "15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
];

function useTooltipPosition(pos, toolCat) {
    const isYoung = useMemo(
        () => YOUNG_AGE_GROUPS.includes(toolCat?.ageGroup),
        [toolCat?.ageGroup]
    );

    const left = useMemo(() => {
        const rightEdge = pos.x + CURSOR_OFFSET + TOOLTIP_WIDTH;
        const isOffScreen = rightEdge > window.innerWidth;
        return isOffScreen
            ? pos.x - TOOLTIP_WIDTH - CURSOR_OFFSET
            : pos.x + CURSOR_OFFSET;
    }, [pos.x]);

    const top = useMemo(() => {
        if (isYoung) {
            return toolCat.gender === "both"
                ? pos.y - Y_OFFSET_TOP
                : pos.y - Y_OFFSET_BOTTOM;
        }
        return pos.y + CURSOR_OFFSET;
    }, [pos.y, isYoung, toolCat?.gender]);

    return { top, left };
}

function Tooltip({ pos, data, toolCat }) {
    const { top, left } = useTooltipPosition(pos, toolCat);

    if (!data || !toolCat) return null;

    const tooltipStyle = {
        position: "absolute",
        top,
        left,
    };

    const title =
        toolCat.gender === "both"
            ? `${
                  toolCat.ageGroup === "100+"
                      ? "100歳以上"
                      : `${toolCat.ageGroup.replace("-", "~")}歳`
              }`
            : `${toolCat.gender === "male" ? "男性: " : "女性: "}${
                  toolCat.ageGroup === "100+"
                      ? "100歳以上"
                      : `${toolCat.ageGroup.replace("-", "~")}歳`
              }`;

    return (
        <div style={tooltipStyle}>
            <Card sx={{ width: TOOLTIP_WIDTH }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>
                </CardContent>
                <CardActionArea>
                    <CardActions>
                        {toolCat.gender === "both" ? (
                            <BothTable data={data} categories={toolCat} />
                        ) : (
                            <InfoTable data={data} categories={toolCat} />
                        )}
                    </CardActions>
                </CardActionArea>
            </Card>
        </div>
    );
}

function InfoTable({ data, categories }) {
    const { town, ageGroup, gender } = categories;

    const populationData = useMemo(
        () => data.find((item) => item.town === town)?.data || [],
        [data, town]
    );

    const populationSum = useMemo(
        () =>
            populationData
                .flatMap((e) => [e.male, e.female])
                .reduce((sum, element) => sum + element, 0),
        [populationData]
    );

    const townPopulation = useMemo(
        () =>
            populationData.find((item) => item.ageGroup === ageGroup)?.[
                gender
            ] || 0,
        [populationData, ageGroup, gender]
    );

    const rows = [
        { label: "人数(人)", value: townPopulation },
        {
            label: "この地域における割合(%)",
            value: d3.format(".4f")((townPopulation / populationSum) * 100),
        },
    ];

    return (
        <TableContainer>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
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

function BothTable({ data, categories }) {
    const { town, ageGroup } = categories;

    const populationData = useMemo(
        () => data.find((item) => item.town === town)?.data || [],
        [data, town]
    );

    const populationSum = useMemo(
        () =>
            populationData
                .flatMap((e) => [e.male, e.female])
                .reduce((sum, element) => sum + element, 0),
        [populationData]
    );

    const malePopulation = useMemo(
        () =>
            populationData.find((item) => item.ageGroup === ageGroup)?.male ||
            0,
        [populationData, ageGroup]
    );

    const femalePopulation = useMemo(
        () =>
            populationData.find((item) => item.ageGroup === ageGroup)
                ?.female || 0,
        [populationData, ageGroup]
    );

    const rows = [
        {
            label: "人数(人)",
            male: malePopulation,
            female: femalePopulation,
        },
        {
            label: "この地域における割合(%)",
            male: d3.format(".4f")((malePopulation / populationSum) * 100),
            female: d3.format(".4f")((femalePopulation / populationSum) * 100),
        },
    ];

    return (
        <TableContainer>
            <Table sx={{ minWidth: 300 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>項目</TableCell>
                        <TableCell align="right">男性</TableCell>
                        <TableCell align="right">女性</TableCell>
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
                            <TableCell align="right">{row.male}</TableCell>
                            <TableCell align="right">{row.female}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Tooltip;
