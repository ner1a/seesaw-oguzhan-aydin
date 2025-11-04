const plank = document.getElementById('plank');
const seesawContainer = document.getElementById('seesaw-container');
const leftWeightEl = document.getElementById('left-weight');
const rightWeightEl = document.getElementById('right-weight');
const angleEl = document.getElementById('angle');
const resetButton = document.getElementById('reset-button');

const PLANK_WIDTH = 400;
const PIVOT_CENTER = PLANK_WIDTH / 2;
const MAX_ANGLE = 30;

let nextWeight = generateRandomWeight();
let currentAngle = 0;
let objects = [];

function generateRandomWeight() {
    return (Math.random() * (10 - 1) + 1).toFixed(1);
}

function getObjectSize(weight) {
    return 30 + (weight - 1) * 4;
}

plank.addEventListener('click', (e) => {
    const weight = parseFloat(nextWeight);

    const rect = plank.getBoundingClientRect();
    const clickX = e.clientX - rect.left;

    const obj = {
        weight: weight,
        size: getObjectSize(weight),
        x: clickX
    };

    objects.push(obj);
    nextWeight = generateRandomWeight();
    calculate();
    console.log(objects); // DEBUG
});

function calculate() {
    let leftTorque = 0;
    let rightTorque = 0;
    let leftWeight = 0;
    let rightWeight = 0;

    objects.forEach(obj => {
        const distanceFromPivot = obj.x - PIVOT_CENTER;
        const torque = obj.weight * Math.abs(distanceFromPivot);

        if (distanceFromPivot < 0) {
            // Sol
            leftTorque += torque;
            leftWeight += obj.weight;
        } else if (distanceFromPivot > 0) {
            // Sağ
            rightTorque += torque;
            rightWeight += obj.weight;
        }
    });

    const torqueDifference = rightTorque - leftTorque;
    const targetAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDifference));

    leftWeightEl.textContent = leftWeight.toFixed(1) + ' kg';
    rightWeightEl.textContent = rightWeight.toFixed(1) + ' kg';
    angleEl.textContent = targetAngle.toFixed(1) + '°';
    plank.style.transform = `rotate(${targetAngle}deg)`;
}

resetButton.addEventListener('click', () => {
    objects = [];
    currentAngle = 0;

    leftWeightEl.textContent = '0 kg';
    rightWeightEl.textContent = '0 kg';
    angleEl.textContent = '0°';
    plank.style.transform = 'none';
    nextWeight = generateRandomWeight();
});