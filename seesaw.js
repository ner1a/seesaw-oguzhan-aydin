const plank = document.getElementById('plank');

let nextWeight = generateRandomWeight();

function generateRandomWeight() {
    return  (Math.random() * (10 - 1) + 1).toFixed(1);
}

function getObjectSize(weight) {
    return 30 + (weight - 1) * 4;
}

plank.addEventListener('click', (e) => {
    const weight = parseFloat(nextWeight);

    const obj = {
        weight: weight,
        size: getObjectSize(weight)
    };

    console.log(obj);
});