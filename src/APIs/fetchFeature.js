export async function fetchFeature(year) {
    const response = await fetch(
        `https://raw.githubusercontent.com/Shirashoji/chofu-population-dataset/main/mapFeature/${year}.json`
    );
    const data = await response.json();
    return data;
}
