
// ==========================================
// DIGITAL DARK SPOT
// Complete Updated Frontend JavaScript
// ==========================================

// ------------------------------------------
// 1. GLOBAL DATA
// ------------------------------------------

let sources = JSON.parse(localStorage.getItem("dds_sources") || "[]");

let currentResearchTopic = "";
let currentDomain = "Business";


// ------------------------------------------
// 2. STORAGE
// ------------------------------------------

function saveSources() {
    localStorage.setItem("dds_sources", JSON.stringify(sources));
}


// ------------------------------------------
// 3. SECURITY HELPERS
// ------------------------------------------

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function safeURL(value) {
    try {
        const url = new URL(value);

        return ["http:", "https:"].includes(url.protocol)
            ? url.href
            : "";

    } catch {
        return "";
    }
}


// ------------------------------------------
// 4. NAVIGATION
// ------------------------------------------

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    const activeButton = document.querySelector(
        `.nav-btn[onclick*="${pageId}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    const pageName = document.getElementById("pageName");

    if (pageName) {
        pageName.textContent =
            pageId.charAt(0).toUpperCase() + pageId.slice(1);
    }
}


// ------------------------------------------
// 5. DOMAIN SELECTION
// ------------------------------------------

function setDomain(domain) {

    if (!["Scholarship", "Education", "Business"].includes(domain)) {
        return;
    }

    currentDomain = domain;
}


// ------------------------------------------
// 6. TOPIC SELECTION
// ------------------------------------------

function setTopic(topic) {

    currentResearchTopic = topic;

    const topicInput = document.getElementById("topic");
    const currentTopic = document.getElementById("currentTopic");
    const analysisTopic = document.getElementById("analysisTopic");

    if (topicInput) topicInput.value = topic;
    if (currentTopic) currentTopic.textContent = topic;
    if (analysisTopic) analysisTopic.textContent = topic;

    showPage("sources");
}


// ------------------------------------------
// 7. TOPIC FORM
// ------------------------------------------

document.getElementById("topicForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const topic = document.getElementById("topic").value.trim();

    if (!topic) {
        alert("Please enter a research topic.");
        return;
    }

    currentResearchTopic = topic;

    document.getElementById("currentTopic").textContent = topic;
    document.getElementById("analysisTopic").textContent = topic;

    showPage("sources");
});


// ------------------------------------------
// 8. ADD SOURCE
// ------------------------------------------

document.getElementById("sourceForm")?.addEventListener("submit", event => {

    event.preventDefault();

    const title = document.getElementById("sourceTitle").value.trim();
    const url = document.getElementById("sourceUrl").value.trim();
    const date = document.getElementById("sourceDate").value;
    const content = document.getElementById("sourceContent").value.trim();

    if (!title || !content) {
        alert("Please enter a source title and content.");
        return;
    }

    if (url && !safeURL(url)) {
        alert("Please enter a valid HTTP or HTTPS URL.");
        return;
    }

    sources.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title,
        url,
        date,
        content
    });

    saveSources();

    event.target.reset();

    displaySources();
    updateStats();
});


// ------------------------------------------
// 9. DISPLAY SOURCE LIBRARY
// ------------------------------------------

function displaySources() {

    const container = document.getElementById("sourceList");

    if (!container) return;

    if (sources.length === 0) {
        container.innerHTML = "<p>No sources added yet.</p>";
        return;
    }

    container.innerHTML = sources.map((source, index) => `

        <div class="card">

            <h3>Source ${index + 1}: ${escapeHTML(source.title)}</h3>

            <p>
                ${escapeHTML(source.content.slice(0, 220))}
                ${source.content.length > 220 ? "..." : ""}
            </p>

            <p>
                <strong>Publication date:</strong>
                ${escapeHTML(source.date || "Not provided")}
            </p>

            ${safeURL(source.url) ? `
                <p>
                    <a href="${escapeHTML(safeURL(source.url))}"
                       target="_blank"
                       rel="noopener noreferrer">
                       Open original source
                    </a>
                </p>
            ` : "<p>Source URL not provided.</p>"}

            <button onclick="removeSource('${escapeHTML(source.id)}')">
                Remove Source
            </button>

        </div>

    `).join("");
}


// ------------------------------------------
// 10. REMOVE SOURCE
// ------------------------------------------

function removeSource(id) {

    sources = sources.filter(
        source => String(source.id) !== String(id)
    );

    saveSources();

    displaySources();
    updateStats();
}


// ------------------------------------------
// 11. DASHBOARD STATISTICS
// ------------------------------------------

function updateStats() {

    const totalSources = document.getElementById("totalSources");

    if (totalSources) {
        totalSources.textContent = sources.length;
    }
}


// ------------------------------------------
// 12. DOMAIN-SPECIFIC RESEARCH TOPICS
// ------------------------------------------

function getDomainTopics() {

    const topics = {

        Scholarship: [

            {
                name: "Eligibility requirements",
                terms: ["eligibility", "eligible", "qualification"]
            },

            {
                name: "Application deadlines",
                terms: ["deadline", "last date", "closing date", "application date"]
            },

            {
                name: "Required documents",
                terms: ["documents", "certificate", "income proof", "transcript"]
            },

            {
                name: "Renewal conditions",
                terms: ["renewal", "renew", "continuation", "reapply"]
            },

            {
                name: "Scholarship amount",
                terms: ["amount", "award", "stipend", "financial assistance"]
            }
        ],

        Education: [

            {
                name: "Course curriculum",
                terms: ["curriculum", "syllabus", "subjects", "course content"]
            },

            {
                name: "Fees and costs",
                terms: ["fee", "fees", "tuition", "cost"]
            },

            {
                name: "Admission requirements",
                terms: ["admission", "eligibility", "entrance exam"]
            },

            {
                name: "Placement information",
                terms: ["placement", "employment", "career", "salary"]
            },

            {
                name: "Course duration",
                terms: ["duration", "semester", "years", "months"]
            }
        ],

        Business: [

            {
                name: "Business registration",
                terms: ["registration", "registered", "incorporation", "company registration"]
            },

            {
                name: "Ownership and directors",
                terms: ["owner", "ownership", "director", "founder", "shareholder"]
            },

            {
                name: "Financial health",
                terms: ["financial", "revenue", "profit", "investment", "debt", "working capital"]
            },

            {
                name: "Legal compliance",
                terms: ["legal", "compliance", "license", "licence", "tax", "permit"]
            },

            {
                name: "Customer reputation",
                terms: ["customer", "reviews", "reputation", "complaints", "satisfaction"]
            }
        ]
    };


    // Special categories for business loan research.
    if (currentDomain === "Business") {

        const topic = currentResearchTopic.toLowerCase();

        if (
            topic.includes("loan") ||
            topic.includes("repayment") ||
            topic.includes("borrowing") ||
            topic.includes("credit")
        ) {

            return [

                {
                    name: "Loan eligibility",
                    terms: ["eligibility", "eligible", "qualify", "qualification"]
                },

                {
                    name: "Interest rates",
                    terms: ["interest", "rate", "apr"]
                },

                {
                    name: "Loan amount and funding",
                    terms: ["loan amount", "funding", "loan", "finance"]
                },

                {
                    name: "Repayment conditions",
                    terms: ["repayment", "installment", "emi", "tenure"]
                },

                {
                    name: "Required documents",
                    terms: ["documents", "certificate", "identity proof", "financial statements"]
                }
            ];
        }
    }

    return topics[currentDomain] || topics.Business;
}


// ------------------------------------------
// 13. FIND SOURCE EVIDENCE
// ------------------------------------------

function findEvidence(topic) {

    const matchingSources = [];

    const negativePatterns = [
        /\bnot available\b/i,
        /\bnot provided\b/i,
        /\bnot mentioned\b/i,
        /\bdoes not provide\b/i,
        /\bdo not provide\b/i,
        /\bno information\b/i,
        /\bmissing\b/i,
        /\bunclear\b/i,
        /\bnot disclosed\b/i,
        /\bunavailable\b/i
    ];

    sources.forEach(source => {

        const text = source.content;
        const lowerText = text.toLowerCase();

        let matchedEvidence = null;

        for (const term of topic.terms) {

            let position = lowerText.indexOf(term.toLowerCase());

            while (position !== -1) {

                const start = Math.max(0, position - 100);

                const end = Math.min(
                    text.length,
                    position + term.length + 120
                );

                const context = text.slice(start, end);

                const isNegative = negativePatterns.some(pattern =>
                    pattern.test(context)
                );

                if (!isNegative) {

                    matchedEvidence = {
                        term,
                        position
                    };

                    break;
                }

                position = lowerText.indexOf(
                    term.toLowerCase(),
                    position + term.length
                );
            }

            if (matchedEvidence) break;
        }

        if (matchedEvidence) {

            const { term, position } = matchedEvidence;

            const start = Math.max(0, position - 65);

            const end = Math.min(
                text.length,
                position + term.length + 120
            );

            matchingSources.push({

                title: source.title,
                url: source.url,
                date: source.date,

                snippet: text.slice(start, end),

                matchedTerm: term
            });
        }
    });

    return matchingSources;
}


// ------------------------------------------
// 14. GENERATE RESEARCH SUMMARY
// ------------------------------------------

function generateResearchSummary() {

    const container = document.getElementById("summaryResults");

    if (!container) return;

    if (sources.length === 0) {
        container.innerHTML = "<p>No sources available.</p>";
        return;
    }

    container.innerHTML = sources.map((source, index) => `

        <div class="card">

            <h3>
                Source ${index + 1}: ${escapeHTML(source.title)}
            </h3>

            <p>
                ${escapeHTML(source.content.slice(0, 350))}
                ${source.content.length > 350 ? "..." : ""}
            </p>

            <small>
                Publication date:
                ${escapeHTML(source.date || "Not provided")}
            </small>

            ${safeURL(source.url) ? `
                <p>
                    <a href="${escapeHTML(safeURL(source.url))}"
                       target="_blank"
                       rel="noopener noreferrer">
                       View original source
                    </a>
                </p>
            ` : ""}

        </div>

    `).join("");
}


// ------------------------------------------
// 15. SOURCE FRESHNESS MONITORING
// ------------------------------------------

function getFreshnessFindings() {

    const findings = [];

    const today = new Date();

    sources.forEach(source => {

        if (!source.date) {

            findings.push({
                title: source.title,
                url: source.url,
                issue: "Publication date not provided."
            });

            return;
        }

        const date = new Date(source.date + "T00:00:00");

        if (Number.isNaN(date.getTime())) {

            findings.push({
                title: source.title,
                url: source.url,
                issue: "Publication date could not be interpreted."
            });

        } else if (date > today) {

            findings.push({
                title: source.title,
                url: source.url,
                issue: "Publication date is in the future. Verify it."
            });

        } else {

            const ageDays =
                (today - date) / (1000 * 60 * 60 * 24);

            if (ageDays > 365) {

                findings.push({
                    title: source.title,
                    url: source.url,
                    issue: "Source is over one year old. Check for updates."
                });
            }
        }
    });

    return findings;
}


// ------------------------------------------
// 16. METRIC-BASED NUMERICAL COMPARISON
// ------------------------------------------

function compareSources() {

    const findings = [];

    const metrics = [

        {
            name: "Annual revenue",
            pattern: /\b(?:annual|yearly)\s+revenue\b|\brevenue\b/gi
        },

        {
            name: "Operating expenses",
            pattern: /\b(?:operating|annual|total)\s+expenses\b|\bexpenses\b/gi
        },

        {
            name: "Operating profit",
            pattern: /\b(?:operating|annual|net)\s+profit\b|\bprofit\b/gi
        },

        {
            name: "Initial investment",
            pattern: /\b(?:initial|startup|start-up)\s+(?:business\s+)?investment\b|\binitial capital\b/gi
        }
    ];


    function extractMetrics(content) {

        const results = {};

        metrics.forEach(metric => {

            const values = [];

            const regex = new RegExp(
                metric.pattern.source,
                "gi"
            );

            let match;

            while ((match = regex.exec(content)) !== null) {

                const metricStart = match.index;
                const metricEnd = metricStart + match[0].length;

                // Look for a currency amount shortly after the metric.
                const afterText = content.slice(
                    metricEnd,
                    metricEnd + 65
                );

                // Also support amounts written before the metric.
                const beforeText = content.slice(
                    Math.max(0, metricStart - 45),
                    metricStart
                );

                const currencyRegex =
                    /(?:₹|INR\b|Rs\.?)\s*([\d,]+(?:\.\d+)?)/i;

                let amountMatch = afterText.match(currencyRegex);

                if (!amountMatch) {
                    amountMatch = beforeText.match(currencyRegex);
                }

                if (!amountMatch) continue;

                const amount = Number(
                    amountMatch[1].replace(/,/g, "")
                );

                if (!Number.isFinite(amount)) continue;

                values.push({

                    amount,

                    display: "₹" + amount.toLocaleString("en-IN")
                });
            }

            if (values.length > 0) {

                results[metric.name] = [
                    ...new Map(
                        values.map(value => [
                            value.amount,
                            value
                        ])
                    ).values()
                ];
            }
        });

        return results;
    }


    // Compare metrics between every pair of sources.
    for (let i = 0; i < sources.length; i++) {

        for (let j = i + 1; j < sources.length; j++) {

            const first = sources[i];
            const second = sources[j];

            const firstMetrics =
                extractMetrics(first.content);

            const secondMetrics =
                extractMetrics(second.content);


            Object.keys(firstMetrics).forEach(metricName => {

                if (!secondMetrics[metricName]) return;

                const valuesA = firstMetrics[metricName];
                const valuesB = secondMetrics[metricName];

                const differentA = [];
                const differentB = [];

                valuesA.forEach(a => {

                    valuesB.forEach(b => {

                        // Equal values are not reported.
                        if (a.amount !== b.amount) {

                            differentA.push(a.display);
                            differentB.push(b.display);
                        }
                    });
                });

                if (differentA.length > 0) {

                    findings.push({

                        first: first.title,
                        firstURL: first.url,

                        second: second.title,
                        secondURL: second.url,

                        topic: metricName,

                        valuesA: [...new Set(differentA)].join(", "),

                        valuesB: [...new Set(differentB)].join(", ")
                    });
                }
            });
        }
    }

    return findings;
}


// ------------------------------------------
// 17. RUN COMPLETE ANALYSIS
// ------------------------------------------

function runAnalysis() {

    if (!currentResearchTopic) {

        const topicInput = document.getElementById("topic");

        if (topicInput && topicInput.value.trim()) {
            currentResearchTopic = topicInput.value.trim();
        } else {
            alert("Please enter a research topic first.");
            showPage("dashboard");
            return;
        }
    }

    if (sources.length === 0) {

        alert("Please add at least one source before analysis.");

        showPage("sources");

        return;
    }

    const gaps = getDomainTopics().map(topic => {

        const evidence = findEvidence(topic);

        return {

            name: topic.name,

            evidence,

            status: evidence.length === 0
                ? "Not covered in collected sources"
                : evidence.length === 1
                    ? "Mentioned in one source"
                    : "Mentioned in multiple sources"
        };
    });


    const freshness = getFreshnessFindings();

    const conflicts = compareSources();


    const recommendations = [

        "Verify important claims using official or primary sources.",

        "Compare key information across independent sources.",

        "Check publication dates and look for recent updates.",

        "Investigate topics that are not covered by collected sources.",

        "Review possible numerical differences before drawing conclusions."
    ];


    generateResearchSummary();

    displayAnalysis(
        gaps,
        freshness,
        conflicts,
        recommendations
    );

    generateChecklist(
        gaps,
        freshness,
        conflicts,
        recommendations
    );

    updateStats();

    showPage("analysis");
}


// ------------------------------------------
// 18. DISPLAY ANALYSIS RESULTS
// ------------------------------------------

function displayAnalysis(
    gaps,
    freshness,
    conflicts,
    recommendations
) {

    const gapContainer = document.getElementById("gapResults");

    const freshContainer = document.getElementById("freshResults");

    const conflictContainer =
        document.getElementById("conflictResults");

    const recommendationContainer =
        document.getElementById("recommendationResults");


    // Information gaps.
    if (gapContainer) {

        gapContainer.innerHTML = gaps.map(gap => {

            const confidence =
                gap.evidence.length >= 2
                    ? "Medium"
                    : "Low";

            return `

                <div class="card">

                    <h3>${escapeHTML(gap.name)}</h3>

                    <p>
                        <strong>Status:</strong>
                        ${escapeHTML(gap.status)}
                    </p>

                    <p>
                        <strong>Signal confidence:</strong>
                        ${confidence}
                    </p>

                    <p>
                        <strong>Supporting sources:</strong>
                        ${gap.evidence.length}
                    </p>

                    ${
                        gap.evidence.length === 0

                        ? `
                            <p>
                                No matching evidence was found in the
                                collected sources. This does not prove
                                the information is unavailable elsewhere.
                            </p>
                        `

                        : gap.evidence.map(item => `

                            <div class="card">

                                <p>
                                    <strong>
                                        ${escapeHTML(item.title)}
                                    </strong>
                                </p>

                                ${
                                    safeURL(item.url)

                                    ? `
                                        <p>
                                            <a href="${escapeHTML(safeURL(item.url))}"
                                               target="_blank"
                                               rel="noopener noreferrer">
                                               View original source
                                            </a>
                                        </p>
                                    `

                                    : "<p>Source URL not provided.</p>"
                                }

                                <p>
                                    ${escapeHTML(item.snippet)}
                                </p>

                                <small>
                                    Matched term:
                                    ${escapeHTML(item.matchedTerm)}
                                </small>

                            </div>

                        `).join("")
                    }

                    <small>
                        Potential research signal — verify before
                        drawing conclusions.
                    </small>

                </div>

            `;

        }).join("");
    }


    // Source freshness.
    if (freshContainer) {

        freshContainer.innerHTML = freshness.length

            ? freshness.map(item => `

                <div class="card">

                    <h3>${escapeHTML(item.title)}</h3>

                    <p>${escapeHTML(item.issue)}</p>

                    ${
                        safeURL(item.url)

                        ? `
                            <a href="${escapeHTML(safeURL(item.url))}"
                               target="_blank"
                               rel="noopener noreferrer">
                               View source
                            </a>
                        `

                        : ""
                    }

                </div>

            `).join("")

            : "<p>No missing or potentially old publication dates flagged.</p>";
    }


    // Metric-based numerical comparison.
    if (conflictContainer) {

        conflictContainer.innerHTML = conflicts.length

            ? conflicts.map(item => `

                <div class="card">

                    <h3>
                        Possible difference — ${escapeHTML(item.topic)}
                    </h3>

                    <p>
                        <strong>${escapeHTML(item.first)}:</strong>
                        ${escapeHTML(item.valuesA)}
                    </p>

                    ${
                        safeURL(item.firstURL)

                        ? `
                            <a href="${escapeHTML(safeURL(item.firstURL))}"
                               target="_blank"
                               rel="noopener noreferrer">
                               View first source
                            </a>
                        `

                        : ""
                    }

                    <p>
                        <strong>${escapeHTML(item.second)}:</strong>
                        ${escapeHTML(item.valuesB)}
                    </p>

                    ${
                        safeURL(item.secondURL)

                        ? `
                            <a href="${escapeHTML(safeURL(item.secondURL))}"
                               target="_blank"
                               rel="noopener noreferrer">
                               View second source
                            </a>
                        `

                        : ""
                    }

                    <small>
                        Check context, units and dates.
                        Different values are not automatically contradictions.
                    </small>

                </div>

            `).join("")

            : "<p>No possible numerical differences detected by this basic comparison.</p>";
    }


    // Recommendations.
    if (recommendationContainer) {

        recommendationContainer.innerHTML =
            recommendations.map(item => `

                <div class="card">

                    <p>${escapeHTML(item)}</p>

                </div>

            `).join("");
    }


    // Dashboard counters.
    const totalGaps = document.getElementById("totalGaps");

    const totalConflicts =
        document.getElementById("totalConflicts");

    const totalOutdated =
        document.getElementById("totalOutdated");


    if (totalGaps) {

        totalGaps.textContent = gaps.filter(
            gap => gap.evidence.length === 0
        ).length;
    }

    if (totalConflicts) {
        totalConflicts.textContent = conflicts.length;
    }

    if (totalOutdated) {
        totalOutdated.textContent = freshness.length;
    }
}


// ------------------------------------------
// 19. GENERATE VERIFICATION CHECKLIST
// ------------------------------------------

function generateChecklist(
    gaps,
    freshness,
    conflicts,
    recommendations
) {

    const container =
        document.getElementById("checklistItems");

    if (!container) return;


    const tasks = [

        ...gaps
            .filter(gap => gap.evidence.length === 0)
            .map(gap => ({
                priority: "High",
                text: `Investigate missing information: ${gap.name}`
            })),

        ...conflicts.map(item => ({
            priority: "High",
            text: `Verify possible ${item.topic} difference between ${item.first} and ${item.second}`
        })),

        ...freshness.map(item => ({
            priority: "High",
            text: `Check source date: ${item.title}`
        })),

        ...gaps
            .filter(gap => gap.evidence.length === 1)
            .map(gap => ({
                priority: "Medium",
                text: `Find another source for: ${gap.name}`
            })),

        ...recommendations.map(item => ({
            priority: "Normal",
            text: item
        }))
    ];


    container.innerHTML = tasks.map(task => `

        <div class="card">

            <label>

                <input type="checkbox">

                <strong>${escapeHTML(task.priority)}:</strong>

                ${escapeHTML(task.text)}

            </label>

        </div>

    `).join("");
}


// ------------------------------------------
// 20. EXPORT CHECKLIST
// ------------------------------------------

function exportChecklist() {

    const checkboxes = document.querySelectorAll(
        "#checklistItems input[type='checkbox']"
    );

    if (!checkboxes.length) {

        alert("Run an analysis first to generate a checklist.");

        return;
    }


    const lines = [...checkboxes].map(checkbox => {

        const label = checkbox.parentElement.textContent.trim();

        return `${checkbox.checked ? "[x]" : "[ ]"} ${label}`;
    });


    const report = [

        "DIGITAL DARK SPOT — VERIFICATION CHECKLIST",

        `Research topic: ${currentResearchTopic}`,

        `Domain: ${currentDomain}`,

        `Sources collected: ${sources.length}`,

        "",

        ...lines,

        "",

        "Note: Findings are rule-based research signals, not verified facts."

    ].join("\n");


    const blob = new Blob(
        [report],
        { type: "text/plain;charset=utf-8" }
    );

    const objectURL = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = objectURL;

    link.download = "digital-dark-spot-checklist.txt";

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => URL.revokeObjectURL(objectURL), 1000);
}


// ------------------------------------------
// 21. LOAD EXAMPLE TOPICS
// ------------------------------------------

function loadExamples() {

    const examples = {

        Scholarship:
            "What should I verify before applying for a scholarship?",

        Education:
            "What factors should I compare before choosing a college?",

        Business:
            "What should I verify before working with a business?"
    };


    setTopic(
        examples[currentDomain] || examples.Business
    );
}


// ------------------------------------------
// 22. RESTORE DATA ON PAGE LOAD
// ------------------------------------------

displaySources();

updateStats();


// ==========================================
// END OF DIGITAL DARK SPOT JAVASCRIPT
// ==========================================
