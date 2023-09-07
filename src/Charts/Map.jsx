import * as d3 from "d3";
import React from "react";
import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";
import { colors } from "@mui/material";

function RGB2HSL(color) {
    const hslColor = d3.hsl(color);
    return `hsl(${hslColor.h}, ${hslColor.s * 100}%, ${hslColor.l * 100}%)`;
}

export default function Map(props) {
    const { geojson, feature, setName } = props;

    if (geojson.length === 0) {
        return (
            <div>
                <p>loading</p>
            </div>
        );
    }

    const width = 500;
    const height = width * 0.9;
    const projection = geoMercator().fitExtent(
        [
            [0, 0],
            [width, height * 0.9],
        ],
        geojson
    );
    const path = geoPath().projection(projection);
    const [town, setTown] = React.useState("市内全域");
    const [selected, setSelect] = React.useState(false);

    useEffect(() => {
        if (town) setName(town);
    }, [town]);

    const featScale = d3
        .scaleLinear()
        .domain(
            d3.extent(
                feature
                    .filter((e) => e.town !== "市内全域")
                    .map((item) => item.value)
            )
        )
        .range([0, 1]);

    const mapColors = d3.interpolateBlues;

    const selectedLayer = () => {
        if (town === "市内全域") return null;
        const layer = geojson.features.filter(
            (e) => e.properties.name === town
        );
        const fillCol =
            feature.length === 0
                ? "#eee"
                : feature.filter((e) => e.town === town).length > 0
                ? mapColors(
                      featScale(feature.filter((e) => e.town === town)[0].value)
                  )
                : "gray";
        console.log(layer);
        return (
            <g className="selected-layer">
                {layer.map((d, i) => (
                    <path
                        key={`selectedLayer-${i}`}
                        d={path(d)}
                        fill={fillCol}
                        stroke="#f00"
                        strokeWidth="4"
                        strokeOpacity="1"
                        onMouseEnter={(e) => {
                            if (!selected) {
                                setTown(d.properties.name);
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!selected) {
                                setTown("市内全域");
                            }
                        }}
                        onMouseDown={(e) => {
                            if (!selected) {
                                setSelect(true);
                            } else {
                                setSelect(false);
                            }
                        }}
                    />
                ))}
            </g>
        );
    };

    return (
        <div className="Map">
            {/* <svg width={width} height={height}> */}
            <svg viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <linearGradient id="Gradient" x1="0" x2="1" y1="0" y2="0">
                        {Array.from({ length: 101 }, (_, i) => i / 100).map(
                            (tick, i) => (
                                <stop
                                    key={`gadient-${i}`}
                                    offset={`${i}%`}
                                    stopColor={mapColors(tick)}
                                />
                            )
                        )}
                    </linearGradient>
                </defs>
                <g className="backGround">
                    <rect
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill="#fff"
                        onMouseEnter={(e) => {
                            if (!selected) {
                                setTown("市内全域");
                            }
                        }}
                        onMouseDown={(e) => {
                            setTown("市内全域");
                            setSelect(false);
                        }}
                    />
                </g>
                <g className="geojson-layer">
                    {geojson.features.map((d, i) => {
                        const fillCol =
                            feature.length === 0
                                ? "#eee"
                                : feature.filter(
                                      (e) => e.town === d.properties.name
                                  ).length > 0
                                ? mapColors(
                                      featScale(
                                          feature.filter(
                                              (e) =>
                                                  e.town === d.properties.name
                                          )[0].value
                                      )
                                  )
                                : "gray";
                        return (
                            <path
                                key={i}
                                d={path(d)}
                                fill={fillCol}
                                stroke="#0e1724"
                                strokeWidth="1"
                                strokeOpacity="0.5"
                                onMouseEnter={(e) => {
                                    if (!selected) {
                                        setTown(d.properties.name);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!selected) {
                                        setTown("市内全域");
                                    }
                                }}
                                onMouseDown={(e) => {
                                    setTown(d.properties.name);
                                    setSelect(true);
                                }}
                            />
                        );
                    })}
                    {selectedLayer()}
                </g>
                <text x={width / 2} y={height * 0.98} textAnchor="middle">
                    {town}
                </text>
                <rect
                    x={(height * 3) / 4 - 2}
                    y={(height * 3) / 4 - 2}
                    width={104}
                    height={21}
                    fill="gray"
                />
                <rect
                    x={(height * 3) / 4}
                    y={(height * 3) / 4}
                    width={100}
                    height={17}
                    fill="url(#Gradient)"
                />
                <text
                    x={(height * 3) / 4}
                    y={(height * 3) / 4 + 22}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    color="gray"
                    fontSize="85%"
                >
                    0
                </text>
                <text
                    x={(height * 3) / 4 + 100}
                    y={(height * 3) / 4 + 22}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    color="gray"
                    fontSize="85%"
                >
                    1
                </text>
                <text
                    x={(height * 3) / 4}
                    y={(height * 3) / 4 - 5}
                    textAnchor="start"
                    dominantBaseline="text-top"
                    fontSize="95%"
                >
                    地域特徴度
                </text>

                <text
                    x={(height * 3) / 4}
                    y={(height * 3) / 4 + 60 - 5}
                    textAnchor="start"
                    dominantBaseline="text-top"
                    fontSize="95%"
                >
                    無人地域
                </text>
                <rect
                    x={(height * 3) / 4}
                    y={(height * 3) / 4 + 60}
                    width={100}
                    height={17}
                    fill="gray"
                />
            </svg>
        </div>
    );
}
