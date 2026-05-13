// Chart.js utility and configuration for quantitative results

// Utility to darken hex colors for hover effect
function darkenHex(hex, factor = 0.85) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    let r = Math.floor(parseInt(hex.substr(0,2),16) * factor);
    let g = Math.floor(parseInt(hex.substr(2,2),16) * factor);
    let b = Math.floor(parseInt(hex.substr(4,2),16) * factor);
    let toHex = x => x.toString(16).padStart(2, '0');
    return `#${toHex(Math.min(r,255))}${toHex(Math.min(g,255))}${toHex(Math.min(b,255))}`;
}

// Utility to darken any color (hex or rgba) for hover effect
function darkenColor(color, factor = 0.85) {
    // Handle rgba format
    if (color.startsWith('rgba')) {
        const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (match) {
            let r = Math.floor(parseInt(match[1]) * factor);
            let g = Math.floor(parseInt(match[2]) * factor);
            let b = Math.floor(parseInt(match[3]) * factor);
            let a = match[4];
            return `rgba(${Math.min(r,255)}, ${Math.min(g,255)}, ${Math.min(b,255)}, ${a})`;
        }
    }
    // Handle hex format
    if (color.startsWith('#')) {
        return darkenHex(color, factor);
    }
    // If unknown format, return as-is
    return color;
}

// Combined data for single chart
const combinedData = [
    { label: "GAGAvatar (1-view)", score: 15.03, color: "#BDD1E7", type: "baseline" },
    { label: "LAM (1-view)", score: 13.31, color: "#BDD1E7", type: "baseline" },
    { label: "Ours (1-view)", score: 17.60, color: "#BDD1E7", type: "baseline", isBold: true },
    { label: "Ours (4-view)", score: 18.78, color: "#BDD1E7", type: "baseline", isBold: true },
    // { label: "Lucy Edit", score: 5.96, color: "#C0C0C0", type: "concurrent" },
    { label: "Ours (4-view)+Personalization", score: 25.78, color: "#7a99c5", type: "ours", isBold: true },
    // { label: "Runway Aleph", score: 7.48, color: "#C0C0C0", type: "concurrent" },
    // { label: "EditVerse", score: 7.64, color: "#C0C0C0", type: "concurrent" },
    // { label: "Ours", score: 7.73, color: "#7a99c5", type: "ours" }
];

const combinedData_ssim = [
    { label: "GAGAvatar (1-view)", score: 0.63, color: "#BDD1E7", type: "baseline" },
    { label: "LAM (1-view)", score: 0.69, color: "#BDD1E7", type: "baseline" },
    { label: "Ours (1-view)", score: 0.75, color: "#BDD1E7", type: "baseline", isBold: true },
    { label: "Ours (4-view)", score: 0.78, color: "#BDD1E7", type: "baseline", isBold: true },
    // { label: "Lucy Edit", score: 5.96, color: "#C0C0C0", type: "concurrent" },
    { label: "Ours (4-view)+Personalization", score: 0.94, color: "#7a99c5", type: "ours", isBold: true },
    // { label: "Runway Aleph", score: 7.48, color: "#C0C0C0", type: "concurrent" },
    // { label: "EditVerse", score: 7.64, color: "#C0C0C0", type: "concurrent" },
    // { label: "Ours", score: 7.73, color: "#7a99c5", type: "ours" }
];

function roundDownToHalf(x) {
    return Math.floor(x * 2) / 2;
}

function roundUpToHalf(x) {
    return Math.ceil(x * 2) / 2;
}

function renderBarChart(canvasId, plotData, minY, maxY, showLegend = false) {
    const labels = plotData.map(d => d.label);
    const scores = plotData.map(d => d.score);
    const barColors = plotData.map(d => d.color);
    const hoverColors = barColors.map(c => darkenHex(c, 0.75));

    // Automatically compute y-axis min/max rounded to closest 0.5
    let minScore = Math.min(...scores);
    let maxScore = Math.max(...scores);
    let computedMinY = roundDownToHalf(minScore);
    let computedMaxY = roundUpToHalf(maxScore);

    // Allow override if provided, otherwise use auto
    minY = (typeof minY === "number") ? minY : computedMinY;
    maxY = (typeof maxY === "number") ? maxY : computedMaxY;

    // Responsive font sizes based on screen width
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    const labelFontSize = isSmallMobile ? 10 : (isMobile ? 11 : 13);
    const tickFontSize = isSmallMobile ? 10 : (isMobile ? 11 : 13);
    const axisFontSize = isSmallMobile ? 12 : (isMobile ? 13 : 15);
    const tickRotation = isSmallMobile ? 60 : 45;

    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score',
                data: scores,
                backgroundColor: barColors,
                hoverBackgroundColor: hoverColors,
                borderRadius: isMobile ? 5 : 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: showLegend,
                    position: 'top',
                    align: 'center',
                    labels: {
                        font: { size: labelFontSize },
                        padding: isMobile ? 10 : 15,
                        usePointStyle: true,
                        pointStyle: 'rect',
                        generateLabels: function(chart) {
                            return [
                                {
                                    text: 'Baselines',
                                    fillStyle: '#BDD1E7',
                                    strokeStyle: '#BDD1E7',
                                    lineWidth: 0
                                },
                                {
                                    text: 'Concurrent/Commercial',
                                    fillStyle: '#C0C0C0',
                                    strokeStyle: '#C0C0C0',
                                    lineWidth: 0
                                },
                                {
                                    text: 'Ours',
                                    fillStyle: '#7a99c5',
                                    strokeStyle: '#7a99c5',
                                    lineWidth: 0
                                }
                            ];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` Score: ${ctx.parsed.y}`
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        font: function(context) {
                            const index = context.index;
                            const isBold = plotData[index]?.isBold || false;
                            return {
                                size: tickFontSize,
                                weight: isBold ? 'bold' : 'normal'
                            };
                        },
                        maxRotation: tickRotation,
                        minRotation: tickRotation,
                        autoSkip: false
                    },
                    grid: { display: false }
                },
                y: {
                    min: minY,
                    max: maxY,
                    title: { 
                        display: true, 
                        text: "Score ↑", 
                        font: { size: axisFontSize } 
                    },
                    ticks: { font: { size: tickFontSize } },
                    grid: { display: false }
                }
            },
            animation: {
                duration: 900,
                easing: 'easeOutCubic'
            }
        }
    });
}

// User Study Chart Data and Configuration
function renderUserStudyChart() {
    // Data from user study results
    const userStudyData = {
        "InsViE-1M": {
            "Instruction Alignment": { better: 150, tie: 3, worse: 7 },
            "Preservation of Unedited Region": { better: 133, tie: 9, worse: 18 },
            "Video Quality": { better: 151, tie: 4, worse: 5 }
        },
        "Lucy Edit": {
            "Instruction Alignment": { better: 140, tie: 5, worse: 15 },
            "Preservation of Unedited Region": { better: 72, tie: 22, worse: 66 },
            "Video Quality": { better: 110, tie: 13, worse: 37 }
        },
        "Señorita-2M": {
            "Instruction Alignment": { better: 126, tie: 14, worse: 20 },
            "Preservation of Unedited Region": { better: 91, tie: 19, worse: 50 },
            "Video Quality": { better: 131, tie: 10, worse: 19 }
        }
    };

    // Create labels for each baseline and criterion combination
    const baselines = Object.keys(userStudyData);
    const criteria = ["Instruction Alignment", "Preservation of Unedited Region", "Video Quality"];
    
    // Create labels: "vs. InsViE-1M: Instruction Alignment", etc.
    const labels = [];
    baselines.forEach(baseline => {
        criteria.forEach(criterion => {
            const shortCriterion = criterion === "Instruction Alignment" ? "Instruction" : 
                                   criterion === "Preservation of Unedited Region" ? "Preservation" : 
                                   "Quality";
            labels.push(`vs. ${baseline}: ${shortCriterion}`);
        });
    });

    // Calculate percentages for Win, Tie, Loss
    const winData = [];
    const tieData = [];
    const lossData = [];

    baselines.forEach(baseline => {
        criteria.forEach(criterion => {
            const scores = userStudyData[baseline][criterion];
            const total = scores.better + scores.tie + scores.worse;
            winData.push(parseFloat(((scores.better / total) * 100).toFixed(1)));
            tieData.push(parseFloat(((scores.tie / total) * 100).toFixed(1)));
            lossData.push(parseFloat(((scores.worse / total) * 100).toFixed(1)));
        });
    });

    // Responsive font sizes based on screen width
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    const labelFontSize = isSmallMobile ? 8 : (isMobile ? 9 : 11);
    const tickFontSize = isSmallMobile ? 8 : (isMobile ? 9 : 11);
    const barBorderRadius = isMobile ? 4 : 6;

    // Define colors and their darker hover versions
    const winColor = '#CBF2DC';
    const tieColor = 'rgba(249, 220, 186, 0.5)';
    const lossColor = 'rgba(233,75,104,0.3)';

    // Plugin to draw horizontal separators between baseline groups (methods)
    const separatorPlugin = {
        id: 'separatorLines',
        afterDraw: (chart) => {
            const ctx = chart.ctx;
            const yAxis = chart.scales.y;
            const xAxis = chart.scales.x;
            
            // Draw lines between baseline groups: after indices 2 and 5
            // (after InsViE-1M group and after Lucy Edit group)
            [2.5, 5.5].forEach(position => {
                // Get pixel position between the bars
                const y1 = yAxis.getPixelForValue(Math.floor(position));
                const y2 = yAxis.getPixelForValue(Math.ceil(position));
                const yPos = (y1 + y2) / 2;
                
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([5, 3]);
                ctx.moveTo(xAxis.left, yPos);
                ctx.lineTo(xAxis.right, yPos);
                ctx.stroke();
                ctx.restore();
            });
        }
    };

    new Chart(document.getElementById('userStudyChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { 
                    label: 'Win', 
                    data: winData, 
                    backgroundColor: winColor, 
                    hoverBackgroundColor: darkenColor(winColor, 0.8), 
                    borderWidth: 0, 
                    borderRadius: { topLeft: barBorderRadius, topRight: 0, bottomLeft: barBorderRadius, bottomRight: 0 }, 
                    borderSkipped: false 
                },
                { 
                    label: 'Tie', 
                    data: tieData, 
                    backgroundColor: tieColor, 
                    hoverBackgroundColor: darkenColor(tieColor, 0.8), 
                    borderWidth: 0, 
                    borderRadius: 0, 
                    borderSkipped: false 
                },
                { 
                    label: 'Loss', 
                    data: lossData, 
                    backgroundColor: lossColor, 
                    hoverBackgroundColor: darkenColor(lossColor, 0.8), 
                    borderWidth: 0, 
                    borderRadius: { topLeft: 0, topRight: barBorderRadius, bottomLeft: 0, bottomRight: barBorderRadius }, 
                    borderSkipped: false 
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: { size: labelFontSize },
                        padding: isMobile ? 6 : 10,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label + ': ' + ctx.parsed.x + '%'
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    max: 100,
                    display: false,
                    grid: { display: false, drawBorder: false }
                },
                y: {
                    stacked: true,
                    ticks: { 
                        font: { size: tickFontSize },
                        autoSkip: false
                    },
                    grid: { display: false, drawBorder: false },
                    border: { display: false },
                    axis: 'y'
                }
            },
            animation: {
                duration: 900,
                easing: 'easeOutCubic'
            }
        },
        plugins: [separatorPlugin]
    });
}

// Initialize charts when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Render combined chart without legend
    renderBarChart('barplot-combined', combinedData, undefined, undefined, false);
    renderBarChart('barplot-combined-ssim', combinedData_ssim, undefined, undefined, false);
    // renderUserStudyChart();
});

// Re-render charts on window resize for better responsiveness
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Destroy existing charts and re-render
        const chartIds = ['barplot-combined', 'barplot-combined-ssim'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const existingChart = Chart.getChart(canvas);
                if (existingChart) {
                    existingChart.destroy();
                }
            }
        });
        
        // Re-render with new responsive settings
        renderBarChart('barplot-combined', combinedData, undefined, undefined, false);
        renderBarChart('barplot-combined-ssim', combinedData_ssim, undefined, undefined, false);
        // renderUserStudyChart();
    }, 250);
});

