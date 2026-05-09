console.log("🔥 script.js loaded successfully");

let currentCase = null;

// =========================
// RESIZABLE PANELS
// =========================

function initResizablePanels() {
    const divider = document.getElementById('divider');
    const container = document.querySelector('.resizable-container');
    const inputPanel = document.getElementById('inputPanel');
    const outputPanel = document.getElementById('outputPanel');
    
    let isDragging = false;
    let startX = 0;
    let startLeftWidth = 0;
    let startRightWidth = 0;
    
    // Mouse events
    divider.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    // Touch events for mobile
    divider.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', stopDragging);
    
    function startDragging(e) {
        isDragging = true;
        divider.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        startX = clientX;
        
        const containerRect = container.getBoundingClientRect();
        const totalWidth = containerRect.width;
        
        startLeftWidth = inputPanel.offsetWidth;
        startRightWidth = outputPanel.offsetWidth;
        
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - startX;
        
        const containerRect = container.getBoundingClientRect();
        const totalWidth = containerRect.width;
        
        // Calculate new widths
        let newLeftWidth = startLeftWidth + deltaX;
        let newRightWidth = startRightWidth - deltaX;
        
        // Apply constraints
        const minWidth = 200;
        const maxWidth = totalWidth * 0.8;
        
        if (newLeftWidth < minWidth) {
            newLeftWidth = minWidth;
            newRightWidth = totalWidth - minWidth - divider.offsetWidth;
        } else if (newLeftWidth > maxWidth) {
            newLeftWidth = maxWidth;
            newRightWidth = totalWidth - maxWidth - divider.offsetWidth;
        } else if (newRightWidth < minWidth) {
            newRightWidth = minWidth;
            newLeftWidth = totalWidth - minWidth - divider.offsetWidth;
        } else if (newRightWidth > maxWidth) {
            newRightWidth = maxWidth;
            newLeftWidth = totalWidth - maxWidth - divider.offsetWidth;
        }
        
        // Apply new widths using flex-basis
        const leftPercent = (newLeftWidth / totalWidth) * 100;
        const rightPercent = (newRightWidth / totalWidth) * 100;
        
        inputPanel.style.flexBasis = leftPercent + '%';
        outputPanel.style.flexBasis = rightPercent + '%';
        
        e.preventDefault();
    }
    
    function stopDragging() {
        isDragging = false;
        divider.classList.remove('dragging');
    }
}

// Initialize resizable panels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initResizablePanels();
    loadSavedTheme(); // This will also update icons
});

// =========================
// THEME TOGGLE
// =========================

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    const currentIcon = themeToggle.innerText;
    
    console.log('Toggle called. Current icon:', currentIcon);
    
    if (currentIcon === '☀️') {
        // Currently showing Sun (dark theme), switch to light theme
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerText = '🌙';
        console.log('Switched to light theme, icon now Moon');
    } else {
        // Currently showing Moon (light theme), switch to dark theme
        body.classList.remove('light');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerText = '☀️';
        console.log('Switched to dark theme, icon now Sun');
    }
    
    console.log('Body classes:', body.className);
    console.log('New icon:', themeToggle.innerText);
}

function updateThemeIcons() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.log('Theme toggle button not found');
        return;
    }
    
    const isLight = document.body.classList.contains('light');
    const currentText = themeToggle.innerText;
    
    console.log('Theme update:', {
        isLight,
        bodyClasses: document.body.className,
        currentText,
        newIcon: isLight ? '🌙' : '☀️'
    });
    
    if (isLight) {
        // Light mode: show Moon icon
        themeToggle.innerText = '🌙';
        console.log('Set icon to Moon for light theme');
    } else {
        // Dark mode: show Sun icon
        themeToggle.innerText = '☀️';
        console.log('Set icon to Sun for dark theme');
    }
    
    console.log('Final icon:', themeToggle.innerText);
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    console.log('Loading saved theme:', savedTheme);
    
    // Default to dark mode if no saved theme
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        console.log('Applied light theme');
    } else {
        document.body.classList.remove('light');
        console.log('Applied dark theme (default)');
    }
    
    // Update icons immediately after theme is set
    updateThemeIcons();
}

async function loadSynthetic() {
    try {
        console.log("Generating case...");

        const res = await fetch("/synthetic");
        currentCase = await res.json();

        console.log("Case:", currentCase);

        document.getElementById("inputBox").innerText =
            JSON.stringify(currentCase, null, 2);

    } catch (err) {
        console.error("Generate case error:", err);
    }
}

async function runDispute_old() {
    try {
        console.log("🚀 Run Investigation clicked");

        if (!currentCase) {
            alert("Generate case first!");
            return;
        }

        const res = await fetch("/dispute/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentCase)
        });

        console.log("Response status:", res.status);

        const data = await res.json();

        console.log("Result:", data);

        document.getElementById("outputBox").innerText =
            JSON.stringify(data, null, 2);

    } catch (err) {
        console.error("Run error:", err);
        document.getElementById("outputBox").innerText =
            "ERROR: " + err.message;
    }
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle("light");

    const btn = document.getElementById("themeToggle");
    if (document.body.classList.contains("light")) {
        btn.innerText = "🌙";
    } else {
        btn.innerText = "☀️";
    }
}

async function generateCase() {
    const res = await fetch("/synthetic");
    currentCase = await res.json();

    document.getElementById("inputBox").innerText =
        JSON.stringify(currentCase, null, 2);
}

async function runDispute() {
    if (!currentCase) {
        alert("Generate case first!");
        return;
    }

    const spinner = document.getElementById("spinner");
    const btn = document.querySelector("button[onclick='runDispute()']");

    try {
        // Show spinner
        spinner.classList.remove("hidden");
        spinner.style.display = "block";

        // Disable button and change text
        btn.disabled = true;
        btn.innerText = "Processing";

        // Show temporary message
        document.getElementById("outputBox").innerText =
            "⏳ Investigating ...";

        // Start async investigation
        const res = await fetch("/dispute/run", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(currentCase)
        });

        const taskData = await res.json();
        console.log("TASK STARTED:", taskData);

        if (taskData.error) {
            throw new Error(taskData.error);
        }

        // Poll for results
        await pollForResults(taskData.task_id);

    } catch (err) {
        console.error(err);
        document.getElementById("outputBox").innerText =
            "❌ Error: " + err.message;

        // Re-enable button on error
        btn.disabled = false;
        btn.innerText = "Run Investigation";
    }
}

async function pollForResults(taskId) {
    const maxAttempts = 60; // 5 minutes max
    const interval = 5000; // 5 seconds
    let attempts = 0;

    const poll = async () => {
        attempts++;
        
        try {
            const res = await fetch(`/dispute/status/${taskId}`);
            const statusData = await res.json();
            
            console.log(`Poll attempt ${attempts}:`, statusData);

            if (statusData.error) {
                throw new Error(statusData.error);
            }

            // Update status message
            const statusMessages = {
                "pending": "⏳ Investigation queued...",
                "processing": `🔄 Investigating... (${attempts * 5}s)`,
                "completed": "✅ Investigation complete!",
                "failed": "❌ Investigation failed"
            };

            document.getElementById("outputBox").innerText = 
                statusMessages[statusData.status] || "⏳ Processing...";

            if (statusData.status === "completed") {
                // Render the result
                renderResult(statusData.result);
                
                // Hide spinner and re-enable button
                const spinner = document.getElementById("spinner");
                const btn = document.querySelector("button[onclick='runDispute()']");
                
                spinner.classList.add("hidden");
                spinner.style.display = "none";
                
                btn.disabled = false;
                btn.innerText = "Run Investigation";
                
                return;
            }

            if (statusData.status === "failed") {
                throw new Error(statusData.error || "Investigation failed");
            }

            if (statusData.status === "processing" && attempts < maxAttempts) {
                // Continue polling
                setTimeout(poll, interval);
            } else if (attempts >= maxAttempts) {
                throw new Error("Investigation timed out");
            }

        } catch (err) {
            console.error(err);
            document.getElementById("outputBox").innerText = 
                "❌ Error: " + err.message;

            // Hide spinner and re-enable button
            const spinner = document.getElementById("spinner");
            const btn = document.querySelector("button:nth-of-type(2)");
            
            spinner.classList.add("hidden");
            spinner.style.display = "none";
            
            btn.disabled = false;
            btn.innerText = "Run Investigation";
        }
    };

    // Start polling
    poll();
}


function renderResult(data) {

    console.log("RAW DATA FROM BACKEND:", data);

    const decision = data?.decision || "N/A";
    const confidence = data?.confidence != null
        ? Math.round(data.confidence * 100)
        : 0;
    const reasoning = data?.reasoning || [];
    const action = data?.recommended_action || "N/A";

    // Format reasoning as HTML list
    const reasoningHtml = reasoning.length
        ? reasoning.map(r => `<div class="reasoning-item">${r}</div>`).join("")
        : "No reasoning available";

    document.getElementById("outputBox").innerHTML = `
        <table class="results-table">
            <tr>
                <td>Decision</td>
                <td>${decision}</td>
            </tr>
            <tr>
                <td>Confidence</td>
                <td>${confidence}%</td>
            </tr>
            <tr>
                <td>Reasoning</td>
                <td>${reasoningHtml}</td>
            </tr>
            <tr>
                <td>Recommended Action</td>
                <td>${action}</td>
            </tr>
        </table>
    `;
}
