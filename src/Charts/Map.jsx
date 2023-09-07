import * as d3 from "d3";
import React from "react";
import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";

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
    const [selected, setSelect] = React.useState(null);

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

    return (
        <div className="Map">
            {/* <svg width={width} height={height}> */}
            <svg viewBox={`0 0 ${width} ${height}`}>
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
                                : "white";
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
                                        if (!selected) {
                                            setTown(d.properties.name);
                                        }
                                        select(e.target).attr(
                                            "stroke-width",
                                            "5"
                                        );
                                        select(e.target).attr("stroke", "#f00");
                                        select(e.target).attr(
                                            "stroke-opacity",
                                            "1"
                                        );
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!selected) {
                                        select(e.target).attr(
                                            "stroke-width",
                                            "1"
                                        );
                                        select(e.target).attr(
                                            "stroke",
                                            "#0e1724"
                                        );
                                        select(e.target).attr(
                                            "stroke-opacity",
                                            "0.5"
                                        );
                                        setTown("市内全域");
                                    }
                                }}
                                onMouseDown={(e) => {
                                    if (!selected) {
                                        select(e.target).attr(
                                            "stroke-width",
                                            "5"
                                        );
                                        select(e.target).attr("stroke", "#f00");
                                        select(e.target).attr(
                                            "stroke-opacity",
                                            "1"
                                        );
                                        setTown(d.properties.name);
                                        setSelect(e.target);
                                    } else {
                                        setTown(
                                            town === d.properties.name
                                                ? "市内全域"
                                                : d.properties.name
                                        );
                                        select(selected).attr(
                                            "stroke-width",
                                            "1"
                                        );
                                        select(selected).attr(
                                            "stroke",
                                            "#0e1724"
                                        );
                                        select(selected).attr(
                                            "stroke-opacity",
                                            "0.5"
                                        );
                                        if (town !== d.properties.name) {
                                            select(e.target).attr(
                                                "stroke-width",
                                                "5"
                                            );
                                            select(e.target).attr(
                                                "stroke",
                                                "#f00"
                                            );
                                            select(e.target).attr(
                                                "stroke-opacity",
                                                "1"
                                            );
                                        }
                                        setSelect(null);
                                    }
                                }}
                            />
                        );
                    })}
                </g>
                <text x={width / 2} y={height * 0.98} textAnchor="middle">
                    {town}
                </text>
            </svg>
        </div>
    );
}
