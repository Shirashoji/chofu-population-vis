import * as React from "react";
import * as d3 from "d3";
import Tooltip from "./PyramidTooltip";

export default function Pyramid(props) {
    const { town, data } = props;
    if (data.length === 0) {
        return <p>loading</p>;
    }

    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    const [toolCat, setToolCat] = React.useState(null);

    const displayWidth = 700;
    const displayHeight = displayWidth * 0.9;
    const centerSlid = displayWidth / 9;
    const margin = {
        top: displayWidth / 12,
        right: displayWidth / 13,
        bottom: displayWidth / 10,
        left: displayWidth / 14,
    };
    const scheme = d3.scaleOrdinal(d3.schemeTableau10);
    const width = displayWidth - margin.left - margin.right;
    const height = displayHeight - margin.top - margin.bottom;

    const townList = data.map((item) => item.town);
    if (!townList.includes(town)) {
        return <HumanNotFound town={town} />;
    }

    const populationData = data.filter((item) => item.town === town)[0].data;

    if (
        Math.max(...populationData.map((e) => [e.male, e.female]).flat()) == 0
    ) {
        return <HumanNotFound town={town} />;
    }

    const infoCol = "lightgray";
    const textCol = "black";

    const youngs = ["0-4", "5-9", "10-14"];
    const olds = [
        "65-69",
        "70-74",
        "75-79",
        "80-84",
        "85-89",
        "90-94",
        "95-99",
        "100+",
    ];

    // x軸のスケール
    const xScale = d3
        .scaleLinear()
        .domain([
            0,
            d3.max(populationData.map((e) => [e.male, e.female]).flat()),
        ])
        .range([0, (width - centerSlid) / 2]);

    // y軸のスケール
    const yScale = d3
        .scaleBand()
        .domain(populationData.map((e) => e.ageGroup))
        .padding(0.1)
        .rangeRound([height, 0]);

    const hor = () => {
        return (
            <g transform={`translate(0, ${height})`}>
                <line x1="0" y1="0" x2={width} y2="0" stroke={infoCol} />
                {xScale.ticks().map((d, i) => {
                    return (
                        <g key={`${i}`}>
                            <g
                                key={`female-${i}`}
                                transform={`translate(${
                                    (width + centerSlid) / 2 + xScale(d)
                                }, 0)`}
                            >
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2={i % 2 == 0 ? 10 : 25}
                                    stroke={infoCol}
                                />
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2={-height}
                                    stroke={"lightgray"}
                                />

                                <text
                                    x={0}
                                    y={i % 2 == 0 ? 20 : 35}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={textCol}
                                >
                                    {d}
                                </text>
                            </g>
                            <g
                                key={`male-${i}`}
                                transform={`translate(${
                                    (width - centerSlid) / 2 - xScale(d)
                                }, 0)`}
                            >
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2={i % 2 == 0 ? 10 : 25}
                                    stroke={infoCol}
                                />
                                <line
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2={-height}
                                    stroke={"lightgray"}
                                />
                                <text
                                    x={0}
                                    y={i % 2 == 0 ? 20 : 35}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={textCol}
                                >
                                    {d}
                                </text>
                            </g>
                        </g>
                    );
                })}
                <text
                    x={width / 2}
                    y={40}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textCol}
                >
                    人口
                </text>
                <text
                    x={width / 2}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textCol}
                >
                    (人)
                </text>
                <text
                    x={width / 4}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textCol}
                >
                    男性
                </text>
                <text
                    x={(width * 3) / 4}
                    y={60}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textCol}
                >
                    女性
                </text>
            </g>
        );
    };

    const vert = () => {
        return (
            <g transform={`translate(${width / 2}, 0)`}>
                <g transform={`translate(${centerSlid / 2}, 0)`}>
                    <line x1="0" y1="0" x2="0" y2={height} stroke={infoCol} />
                </g>
                <g transform={`translate(${-centerSlid / 2}, 0)`}>
                    <line x1="0" y1="0" x2="0" y2={height} stroke={infoCol} />
                </g>
                {yScale.domain().map((d, i) => {
                    return (
                        <g key={i} transform={`translate(0, ${yScale(d)})`}>
                            <text
                                x={0}
                                y={yScale.bandwidth() / 2}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fill={textCol}
                                onMouseEnter={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                    setToolCat({
                                        ageGroup: d,
                                        town: town,
                                        gender: "both",
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    setToolCat(null);
                                }}
                                onPointerMove={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                }}
                            >
                                {d}
                            </text>
                        </g>
                    );
                })}
            </g>
        );
    };

    const createBar = (data) => {
        return (
            <g>
                {data.map((d, i) => {
                    return (
                        <g
                            key={i}
                            transform={`translate(${
                                (width + centerSlid) / 2
                            }, ${yScale(d.ageGroup)})`}
                        >
                            <rect
                                x="0"
                                y="0"
                                width={`${xScale(d.female)}`}
                                height={yScale.bandwidth()}
                                fill={
                                    youngs.includes(d.ageGroup)
                                        ? "salmon"
                                        : olds.includes(d.ageGroup)
                                        ? "indianred"
                                        : "crimson"
                                }
                                onMouseEnter={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                    setToolCat({
                                        ageGroup: d.ageGroup,
                                        town: town,
                                        gender: "female",
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    setToolCat(null);
                                }}
                                onPointerMove={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                }}
                            />
                        </g>
                    );
                })}
                {data.map((d, i) => {
                    return (
                        <g
                            key={i}
                            transform={`translate(${
                                (width - centerSlid) / 2
                            }, ${yScale(d.ageGroup)})`}
                        >
                            <rect
                                x={`${-xScale(d.male)}`}
                                y="0"
                                width={`${xScale(d.male)}`}
                                height={yScale.bandwidth()}
                                fill={
                                    youngs.includes(d.ageGroup)
                                        ? "dodgerblue"
                                        : olds.includes(d.ageGroup)
                                        ? "steelblue"
                                        : "royalblue"
                                }
                                onMouseEnter={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                    setToolCat({
                                        ageGroup: d.ageGroup,
                                        town: town,
                                        gender: "male",
                                    });
                                }}
                                onMouseLeave={(e) => {
                                    setToolCat(null);
                                }}
                                onPointerMove={(e) => {
                                    setPos({ x: e.pageX, y: e.pageY });
                                }}
                            />
                        </g>
                    );
                })}
            </g>
        );
    };

    if (populationData.length === 0) {
        return <div>loading...</div>;
    }

    return (
        <>
            <svg
                viewBox={`0 0 ${displayWidth} ${displayHeight}`}
                style={{
                    userSelect: "none",
                }}
            >
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    {hor()}
                    {vert()}
                    {createBar(populationData)}
                </g>
            </svg>
            <Tooltip
                pos={pos}
                data={data}
                toolCat={toolCat}
                pyramidSize={{ width: displayWidth, height: displayHeight }}
            />
        </>
    );
}

function HumanNotFound(props) {
    const { town } = props;
    const displayWidth = 700;
    const displayHeight = displayWidth * 0.9;
    const margin = {
        top: displayWidth / 12,
        right: displayWidth / 13,
        bottom: displayWidth / 10,
        left: displayWidth / 14,
    };
    const width = displayWidth - margin.left - margin.right;
    const height = displayHeight - margin.top - margin.bottom;

    return (
        <>
            <svg
                viewBox={`0 0 ${displayWidth} ${displayHeight}`}
                style={{
                    background: "white",
                    userSelect: "none",
                }}
            >
                <image
                    x={displayWidth / 2 - 150}
                    y={displayHeight / 6}
                    width="300"
                    height="300"
                    xlinkHref="https://raw.githubusercontent.com/onoue-panda/repository/main/onouepanda-t600.png"
                    href="https://raw.githubusercontent.com/onoue-panda/repository/main/onouepanda-t600.png"
                ></image>
                <rect
                    x={(displayWidth * 2) / 7}
                    y={displayHeight / 4.5}
                    width={(displayWidth * 3) / 7}
                    height={displayHeight / 10}
                ></rect>
                <text
                    x={displayWidth / 2}
                    y={displayHeight / 4.5 + displayHeight / 20}
                    fontSize={displayWidth / 30}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="white"
                >
                    おのうえパンダ制作委員会
                </text>
                <text
                    x={displayWidth / 2}
                    y={(displayHeight * 5) / 7}
                    fontSize={displayWidth / 13}
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    {town}で
                </text>
                <text
                    x={displayWidth / 2}
                    y={(displayHeight * 6) / 7}
                    fontSize={displayWidth / 15}
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    居住者は発見できなかった
                </text>
            </svg>
        </>
    );
}
