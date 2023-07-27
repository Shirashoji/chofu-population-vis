import * as React from "react";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import { select } from "d3-selection";

export default function Pyramid(props) {
  const { town, data } = props;
  if (data.length === 0) {
    return <p>loading</p>;
  }

  // const title = `${town}の人口ピラミッド`;
  const populationData = data.filter((item) => item.town === town)[0].data;

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

  const infoCol = "black";

  // x軸のスケール
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(populationData.map((e) => [e.male, e.female]).flat())])
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
                {/* ウインドウサイズを変更に対応させる時にこの部分を文字幅に応じて縦書きにする */}
                <text
                  x={0}
                  y={i % 2 == 0 ? 20 : 35}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={infoCol}
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
                <text
                  x={0}
                  y={i % 2 == 0 ? 20 : 35}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={infoCol}
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
          fill={infoCol}
        >
          人口
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
                fill={infoCol}
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
    // <g>
    //   {data.map((d, i) => {
    //     return (
    //       <g key={i} transform={`translate(${width}, ${d})`}>
    //         <rect x="0" y="0" width={`${d}`} height="30" fill={"red"} />
    //         <text
    //           x="60"
    //           y="10"
    //           textAnchor="middle"
    //           dominantBaseline="central"
    //           fill={infoCol}
    //         >
    //           {d}
    //         </text>
    //       </g>
    //     );
    //   })}
    // </g>;
    // console.log(data);
    return (
      <g>
        {data.map((d, i) => {
          return (
            <g
              key={i}
              transform={`translate(${(width + centerSlid) / 2}, ${yScale(
                d.ageGroup
              )})`}
            >
              <rect
                x="0"
                y="0"
                width={`${xScale(d.female)}`}
                height={yScale.bandwidth()}
                fill={"red"}
              />
            </g>
          );
        })}
        {data.map((d, i) => {
          return (
            <g
              key={i}
              transform={`translate(${(width - centerSlid) / 2}, ${yScale(
                d.ageGroup
              )})`}
            >
              <rect
                x={`${-xScale(d.male)}`}
                y="0"
                width={`${xScale(d.male)}`}
                height={yScale.bandwidth()}
                fill={"blue"}
              />
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <>
      <svg
        // width={displayWidth}
        // height={displayHeight}
        viewBox={`0 0 ${displayWidth} ${displayHeight}`}
        style={{
          userSelect: "none",
        }}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {hor()}
          {vert()}
          {createBar(populationData)}
          {/* <g transform={`translate(${width + 20}, 0)`}>
            {createLegend(categories)}
          </g> */}
        </g>
      </svg>
    </>
  );
}
