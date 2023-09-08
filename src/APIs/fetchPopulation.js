// データはどっかサーバーに上げるかもしれんのでこれを作っておく

export async function fetchPopulation(year) {
    const response = await fetch(
        `https://raw.githubusercontent.com/Shirashoji/chofu-population-dataset/main/data/${year}.json`
    );
    const data = await response.json();
    return data;
}
