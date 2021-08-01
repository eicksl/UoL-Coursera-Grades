const topElem = document.querySelector('.degree-header-cms-sticky-wrapper');
const wrapper = document.createElement('div');
wrapper.style.padding = '8px 0';
topElem.insertAdjacentElement('afterend', wrapper);

let hasNewGrades = false;
const intGrades = localStorage.getItem('intGrades');
if (!intGrades || intGrades < grades.length) {
    hasNewGrades = true;
    localStorage.setItem('intGrades', grades.length);
}

const gradesHtml = (() => {
    html = '';
    for (const item of grades) {
        html += (`
            <p>
            <div><strong>${item.courseName}</strong></div>
            <div>${item.assignmentName}</div>
            <div>Graded on: ${item.gradedAtTime.split('T')[0]}</div>
            <div>Grade: <strong>${Math.round(item.grade * 100)}%</strong></div>
            </p>
        `);
    }
    return html;
})();

if (!grades.length) {
    wrapper.innerText = 'No grades available at this time';
    wrapper.style.textAlign = 'center';
}
else {
    // modal
    const outerModal = document.createElement('div');
    const innerModal = document.createElement('div');
    outerModal.style.position = 'fixed';
    outerModal.style.zIndex = 998;
    outerModal.style.display = 'none';
    outerModal.style.width = '100%';
    outerModal.style.height = '100%';
    outerModal.style.background = 'darkgray';
    outerModal.style.opacity = 0.5;
    outerModal.style.overflow = 'none';
    outerModal.style.top = 0;
    outerModal.style.left = 0;
    outerModal.addEventListener('click', () => {
        if (hasNewGrades) {
            button.innerText = 'View Available Grades';
            button.style.color = '#000';
        }
        innerModal.style.display = 'none';
        outerModal.style.display = 'none';
    });
    innerModal.style.position = 'absolute';
    innerModal.style.top = '25%';
    innerModal.style.left = '50%';
    innerModal.style.transform = 'translate(-50%, -50%)';
    innerModal.style.zIndex = 999;
    innerModal.style.display = 'none';
    innerModal.style.background = '#fff';
    innerModal.style.padding = '20px 30px';
    innerModal.style.overflow = 'auto';
    innerModal.innerHTML = gradesHtml;
    document.body.appendChild(outerModal);
    document.body.appendChild(innerModal);

    // button
    const button = document.createElement('div');
    if (hasNewGrades) {
        button.innerText = 'New Grade(s) Available';
        button.style.color = 'darkgreen';
    }
    else {
        button.innerText = 'View Available Grades';
    }
    button.style.width = '190px';
    button.style.height = '30px';
    button.style.border = '2px solid';
    button.style.borderRadius = '3px';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.fontFamily = 'monospace';
    button.style.fontWeight = 'bold';
    button.style.margin = '0 auto';
    button.style.cursor = 'pointer';
    button.addEventListener('mouseover', function() {
        this.style.opacity = 0.8;
    });
    button.addEventListener('mouseout', function() {
        this.style.opacity = 1;
    });
    button.addEventListener('click', () => {
        outerModal.style.display = 'block';
        innerModal.style.display = 'block';
    });
    wrapper.appendChild(button);
}
