import * as d3 from "d3";
import React from "react";
import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";

export default function Map(props) {
  const { geojson, feature, setName } = props;

  // if (feature.length === 0) {
  //   return <p>loading</p>;
  // }
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
  const [click, setClick] = React.useState(null);

  useEffect(() => {
    if (town) setName(town);
  }, [town]);

  const featScale = d3
    .scaleLinear()
    .domain(
      d3.extent(
        feature.filter((e) => e.town !== "市内全域").map((item) => item.value)
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
                : feature.filter((e) => e.town === d.properties.name).length > 0
                ? mapColors(
                    featScale(
                      feature.filter((e) => e.town === d.properties.name)[0]
                        .value
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
                  if (!click || town !== d.properties.name) {
                    if (!click) {
                      setTown(d.properties.name);
                    }
                    select(e.target).attr("fill", "#000");
                  }
                }}
                onMouseDown={(e) => {
                  if (click) {
                    select(click[0]).attr("fill", click[1]);
                    if (click[0] !== e.target) {
                      select(e.target).attr("fill", "#F00");
                      setTown(d.properties.name);
                      setClick([e.target, fillCol]);
                    } else {
                      select(click[0]).attr("fill", "#000");
                      setClick(null);
                    }
                  } else {
                    select(e.target).attr("fill", "#F00");
                    setTown(d.properties.name);
                    setClick([e.target, fillCol]);
                  }
                }}
                onMouseOut={(e) => {
                  if (!click || town !== d.properties.name) {
                    select(e.target).attr("fill", fillCol);
                    if (!click[0]) {
                      setTown("市内全域");
                    }
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
