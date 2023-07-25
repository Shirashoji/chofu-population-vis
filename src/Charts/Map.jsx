import * as d3 from "d3";
import React from "react";
import { useEffect, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { select } from "d3-selection";

export default function Map(props) {
  const { geojson, setName } = props;
  const width = 500;
  const height = width * 0.9;
  const projection = geoMercator().fitExtent(
    [
      [0, 0],
      [width * 0.9, height * 0.9],
    ],
    geojson
  );
  const path = geoPath().projection(projection);
  const [town, setTown] = React.useState("市内全域");
  const [click, setClick] = React.useState(null);

  useEffect(() => {
    if (town) setName(town);
  }, [town]);

  return (
    <div className="Map">
      <svg width={width} height={height}>
        <g className="geojson-layer">
          {geojson.features.map((d, i) => (
            <path
              key={i}
              d={path(d)}
              fill="#eee"
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
                  select(click).attr("fill", "#eee");
                }
                select(e.target).attr("fill", "#F00");
                setTown(d.properties.name);
                setClick(e.target);
              }}
              onMouseOut={(e) => {
                if (!click || town !== d.properties.name) {
                  select(e.target).attr("fill", "#eee");
                  if (!click) {
                    setTown("市内全域");
                  }
                }
              }}
            />
          ))}
        </g>
        <text
          x={width / 2 - width * 0.08}
          y={height * 0.98}
          textAnchor="middle"
        >
          {town}
        </text>
      </svg>
    </div>
  );
}
