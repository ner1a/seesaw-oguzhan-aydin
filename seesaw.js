const plank = document.getElementById('plank');
const seesawContainer = document.getElementById('seesaw-container');
const leftWeightEl = document.getElementById('left-weight');
const rightWeightEl = document.getElementById('right-weight');
const angleEl = document.getElementById('angle');
const resetButton = document.getElementById('reset-button');

let previewObject = document.getElementById('preview-object');
let previewLine = document.getElementById('preview-line');
let pivotPoint = document.getElementById('pivot-point');
let previewDistance = document.getElementById('preview-distance');
let clickableArea = document.getElementById('clickable-area');
let previewTork = document.getElementById('preview-tork');

const PLANK_WIDTH = 400;
const PIVOT_CENTER = PLANK_WIDTH / 2;
const MAX_ANGLE = 30;

let nextWeight = generateRandomWeight();
let currentAngle = 0;
let objects = [];

const STORAGE_KEY = 'seesaw_state';

function generateRandomWeight() {
    return (Math.random() * (10 - 1) + 1).toFixed(1);
}

function getObjectSize(weight) {
    return 30 + (weight - 1) * 4;
}

clickableArea.addEventListener('click', (e) => {
    const weight = parseFloat(nextWeight);

    const rect = clickableArea.getBoundingClientRect();
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
    saveState();
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

    const torqueDifference = (rightTorque - leftTorque) / 10;
    const targetAngle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, torqueDifference));

    currentAngle = targetAngle;
    plank.style.transform = `rotate(${currentAngle}deg)`;

    angleEl.textContent = currentAngle.toFixed(1) + '°';
    leftWeightEl.textContent = leftWeight.toFixed(1) + ' kg';
    rightWeightEl.textContent = rightWeight.toFixed(1) + ' kg';
    saveState();
}

function createObjectElement(obj) {
    const size = getObjectSize(obj.weight);
    const radius = size / 2;
    const objDiv = document.createElement('div');
    objDiv.className = 'object fall-in';
    objDiv.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        left: ${obj.x}px;
        top: ${-size}px;
        transform: translateX(-50%);
        transition: transform 2s ease 1s;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${Math.max(10, size / 4)}px;
        font-weight: 400;
        pointer-events: none;
    `;
    switch (true) {
        case obj.weight > 9:
            objDiv.style.backgroundColor = '#9e0142';
            break;
        case obj.weight > 8:
            objDiv.style.backgroundColor = '#d53e4f';
            break;
        case obj.weight > 7:
            objDiv.style.backgroundColor = '#f46d43';
            break;
        case obj.weight > 6:
            objDiv.style.backgroundColor = '#fdae61';
            objDiv.style.color = '#000';
            break;
        case obj.weight > 5:
            objDiv.style.backgroundColor = '#fee08b';
            objDiv.style.color = '#000';
            break;
        case obj.weight > 4:
            objDiv.style.backgroundColor = '#e6f598';
            objDiv.style.color = '#000';
            break;
        case obj.weight > 3:
            objDiv.style.backgroundColor = '#abdda4';
            break;
        case obj.weight > 2:
            objDiv.style.backgroundColor = '#66c2a5';
            break;
        default:
            objDiv.style.backgroundColor = '#3288bd';
            break;
    }
    objDiv.textContent = obj.weight + 'kg';
    objDiv.dataset.id = obj.id;

    plank.appendChild(objDiv);
    obj.element = objDiv;
}

clickableArea.addEventListener('mousemove', (e) => {
    const rect = clickableArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const size = getObjectSize(parseFloat(nextWeight));
    const radius = size / 2;

    previewObject.style.width = size + 'px';
    previewObject.style.height = size + 'px';
    previewObject.style.left = mouseX + 'px';
    previewObject.style.top = (-size - 4) + 'px';
    previewObject.style.transform = 'translateX(-50%)';
    previewObject.textContent = nextWeight + 'kg';
    previewObject.style.opacity = '1';

    const distanceFromPivot = Math.abs(mouseX - PIVOT_CENTER);
    const torque = nextWeight * distanceFromPivot;
    previewTork.textContent = 'Torque: ' + torque.toFixed(0);

    if (mouseX < PIVOT_CENTER) {
        //Sol
        previewDistance.textContent = distanceFromPivot + 'px';
        previewLine.style.left = mouseX + 'px';
        previewLine.style.width = distanceFromPivot + 'px';
    } else {
        //Sağ
        previewDistance.textContent = (distanceFromPivot + 1) + 'px';
        previewLine.style.left = PIVOT_CENTER + 'px';
        previewLine.style.width = distanceFromPivot + 'px';
    }

    previewLine.style.opacity = '1';
    pivotPoint.style.opacity = '1';
});

clickableArea.addEventListener('mouseleave', () => {
    previewObject.style.opacity = '0';
    previewLine.style.opacity = '0';
    pivotPoint.style.opacity = '0';
});

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
    localStorage.removeItem(STORAGE_KEY);
});

function saveState() {
    try {
        const state = {
            objects: objects,
            angle: currentAngle
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error('State kaydedilemedi:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            objects = state.objects || [];
            currentAngle = state.angle || 0;

            objects.forEach(obj => {
                createObjectElement(obj);
            });

            calculate();
        }
    } catch (e) {
        console.error('State yüklenemedi:', e);
    }
}

loadState();