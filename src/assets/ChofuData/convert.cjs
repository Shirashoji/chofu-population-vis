const fs = require("fs");

const data = JSON.parse(fs.readFileSync(`./Chofu-Polygons.geo.json`, "utf8"));

function convert(input) {
    const features = input.features.filter((d) => d.properties.name !== "");
    input.features = features;
    return input;
}

const convertData = JSON.stringify(convert(data));
fs.writeFileSync(`./newChofu-Polygons.geojson`, convertData);
