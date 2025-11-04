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
        x: clickX,
        element: null
    };

    objects.push(obj);
    createObjectElement(obj);
    nextWeight = generateRandomWeight();
    calculate();
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
    
    currentAngle = targetAngle;
    plank.style.transform = `rotate(${currentAngle}deg)`;

    angleEl.textContent = currentAngle.toFixed(1) + '°';
    leftWeightEl.textContent = leftWeight.toFixed(1) + ' kg';
    rightWeightEl.textContent = rightWeight.toFixed(1) + ' kg';
}

function createObjectElement(obj) {
    const size = getObjectSize(obj.weight);
    const radius = size / 2;
    const objDiv = document.createElement('div');
    objDiv.className = 'object';
    objDiv.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: #764ba2;
        border-radius: 50%;
        left: ${obj.x}px;
        top: ${-size}px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${Math.max(10, size / 4)}px;
        font-weight: 400;
        pointer-events: none;
    `;
    objDiv.textContent = obj.weight + 'kg';
    objDiv.dataset.id = obj.id;

    plank.appendChild(objDiv);
    obj.element = objDiv;
}

resetButton.addEventListener('click', () => {
    objects.forEach(obj => {
        if (obj.element) {
            obj.element.remove();
        }
    });

    objects = [];
    currentAngle = 0;

    leftWeightEl.textContent = '0 kg';
    rightWeightEl.textContent = '0 kg';
    angleEl.textContent = '0°';
    plank.style.transform = 'none';
    nextWeight = generateRandomWeight();
});