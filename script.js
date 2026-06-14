// INTERACTIVE DOM SELECTION HANDLES
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const themeToggle = document.getElementById('theme-toggle');
const textTarget = document.getElementById('text-target');

// TERMINAL STATE ENGINE VARIABLE HOOKS
let gameActive = false;
let ctfActive = false; // Tracks if a CTF sub-challenge is running
let currentCtfLevel = 0; // Tracks which CTF level is active
let systemLocked = false; 
const targetSecretPassphrase = "admin";

// COMMAND HISTORY STRINGS POINTERS
let commandHistoryList = [];
let historyPointerLocation = -1;

// AUTO-COMPLETE VALID TARGET ARRAYS
const validSystemCommands = [
    'help', 'about', 'skills', 'clear', 'ls', 'ls -la', 'ls -a',
    'cat rogue_ap.txt', 'cat wireshark.txt', 'cat spycam.txt', 
    'hack', 'whoami', 'matrix', 'uname -a', 'history', 'ctf',
    'ping -c 4 pyle-ap.local', 'ping -c 4 asda-cctv.local'
];

// 1. AUTOMATIC CONTINUOUS TYPING ANIMATION (HEADER)
const phrases = ["$ whoami", "$ execute portfolio.sh", "$ pentester --active"];
let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        textTarget.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
    } else {
        textTarget.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && characterIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// 2. DYNAMIC REALISTIC LINUX KERNEL INITIALIZATION LOG RUNNER
function executeKernelBootSequence() {
    systemLocked = true;
    terminalInput.disabled = true;
    terminalOutput.innerHTML = ''; 
    
    const bootLogs = [
        "[   0.000000] Booting Linux kernel on physical hardware...",
        "[   0.004120] CPU0: Intel(R) Core(TM) Architecture initialized",
        "[   0.021045] ACPI: Core Subsystem System Control initialized",
        "[   0.142510] Memory: 16384K/1048576K available sandbox RAM memory",
        "[   0.381240] USB: Wireless RF core modules interface attached (ESP32-C3)",
        "[   0.620105] Network: Initializing automated multi-hop proxy chains...",
        "[   0.984120] Security: Hardening operational sandbox runtime environment...",
        "[   1.240510] Network: Proxy link established successfully -> 127.0.0.1:9050",
        "[   1.500000] Session authorized. Welcome back, agent."
    ];

    let currentLogIndex = 0;
    function printNextBootLog() {
        if (currentLogIndex < bootLogs.length) {
            logOutput(bootLogs[currentLogIndex], currentLogIndex > 6 ? 'output-success' : 'text-main');
            currentLogIndex++;
            setTimeout(printNextBootLog, Math.random() * 150 + 50);
        } else {
            systemLocked = false;
            terminalInput.disabled = false;
            logOutput("----------------------------------------------------------------", 'output-info');
            logOutput("Type 'help' to review directory flags or 'ctf' to start the challenges.", 'output-info');
            terminalInput.focus();
        }
    }
    printNextBootLog();
}

document.addEventListener("DOMContentLoaded", () => {
    typeEffect();
    executeKernelBootSequence();
});
// 3. THEME SCHEME SWITCH ROUTINE
themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('matrix-theme');
        themeToggle.textContent = "GitHub Mode";
    } else {
        document.body.classList.remove('matrix-theme');
        document.body.classList.add('dark-theme');
        themeToggle.textContent = "Matrix Mode";
    }
});

// 4. COLLAPSIBLE ACCORDION PANELS
function toggleReport(id) {
    const report = document.getElementById(id);
    if (report) {
        report.style.display = (report.style.display === "block") ? "none" : "block";
    }
}

// 5. CATEGORY PORTFOLIO CARD FILTERS
function filterCategory(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    const cards = document.querySelectorAll('.writeup-card');
    cards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// 6. TERMINAL SHIELD KEY CAPTURE SHORTCUT LISTENERS
document.getElementById('terminal').addEventListener('click', () => {
    if (!systemLocked) terminalInput.focus();
});

terminalInput.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        const currentTypedString = this.value.trim().toLowerCase();
        if (currentTypedString === '') return;

        const matches = validSystemCommands.filter(cmd => cmd.startsWith(currentTypedString));
        if (matches.length === 1) {
            this.value = matches; 
        } else if (matches.length > 1) {
            logOutput(`\nPossible completions: ${matches.join(', ')}`, 'output-info');
        }
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (commandHistoryList.length > 0 && historyPointerLocation < commandHistoryList.length - 1) {
            historyPointerLocation++;
            this.value = commandHistoryList[commandHistoryList.length - 1 - historyPointerLocation];
        }
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (historyPointerLocation > 0) {
            historyPointerLocation--;
            this.value = commandHistoryList[commandHistoryList.length - 1 - historyPointerLocation];
        } else if (historyPointerLocation === 0) {
            historyPointerLocation = -1;
            this.value = ''; 
        }
    }

    if (event.key === 'Enter') {
        const inputRaw = this.value.trim();
        
        if (systemLocked) {
            this.value = '';
            return;
        }

        logOutput(`guest@pentest:~$ ${inputRaw}`);
        
        if (inputRaw !== '') {
            commandHistoryList.push(inputRaw);
            historyPointerLocation = -1; 
        }

        if (gameActive) {
            handleGameInput(inputRaw);
        } else if (ctfActive) {
            handleCtfInput(inputRaw);
        } else {
            processCommand(inputRaw.toLowerCase());
        }
        
        this.value = '';
        document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
    }
});

function logOutput(text, className = '') {
    const div = document.createElement('div');
    div.textContent = text;
    if (className) div.className = className;
    terminalOutput.appendChild(div);
    document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;
    return div;
}
function processCommand(cmd) {
    if (cmd === '') return;

    if (cmd.startsWith('cat ')) {
        const fileTarget = cmd.substring(4).trim();
        handleCatCommands(fileTarget);
        return;
    }

    if (cmd.startsWith('ping ')) {
        const targetHost = cmd.substring(5).trim();
        executePingSequence(targetHost);
        return;
    }

    switch(cmd) {
        case 'help':
            logOutput('Standard Shell Utilities:', 'output-info');
            logOutput('  whoami    - Dump active operator user profile clearance details');
            logOutput('  about     - Core profile summary text details dashboard');
            logOutput('  skills    - Technical operations field capability array logs');
            logOutput('  history   - Print session command log with index pointers');
            logOutput('  uname -a  - Print complete system architecture details');
            logOutput('  clear     - Wipe historical line vectors from panel view');
            logOutput('Advanced Directory Tree Routing flags:', 'output-secret');
            logOutput('  ls        - Lists operational documentation files (try "ls -la")');
            logOutput('  cat [file]- Read targeted text files (e.g., cat rogue_ap.txt)');
            logOutput('  ping [ip] - Send standard ICMP echo requests to target host node');
            logOutput('  ctf       - Launch the interactive Mini-CTF challenges terminal');
            logOutput('  hack      - Launch automated interactive firewall bypass game');
            break;
            
        case 'whoami':
            logOutput('------------------------------------------------', 'output-secret');
            logOutput('  USER: guest_operator_01                       ', 'output-success');
            logOutput('  CLEARANCE: Level 3 Physical & RF Auditing     ', 'output-success');
            logOutput('  STATUS: Active Penetration Tester             ', 'output-success');
            logOutput('  TARGET ZONE: South Wales Public Transport Sector', 'output-info');
            logOutput('------------------------------------------------', 'output-secret');
            break;

        case 'about':
            logOutput('I am an ethical hacker specializing in application, network, RF, and on-site field assessments.', 'output-success');
            break;
            
        case 'skills':
            logOutput('Core Stack: Wireshark data forensics, SDR wave replays, RFID credential cloning, hardware debugging.', 'output-success');
            break;

        case 'uname -a':
            logOutput('Linux pentest-sandbox 6.1.0-cyber-core #1 SMP PREEMPT_DYNAMIC GNU/Linux x86_64 standalone', 'text-main');
            break;

        case 'history':
            if (commandHistoryList.length === 0) {
                logOutput('History buffer empty.', 'output-info');
            } else {
                commandHistoryList.forEach((historyCmd, idx) => {
                    logOutput(`  ${idx + 1}  ${historyCmd}`, 'text-main');
                });
            }
            break;

        case 'ls':
            logOutput('wireshark.txt   rogue_ap.txt   spycam.txt', 'text-main');
            break;

        case 'ls -la':
        case 'ls -a':
            logOutput('total 24', 'output-info');
            logOutput('drwxr-xr-x  2 guest staff  4096 Jun 14 13:00 .', 'output-info');
            logOutput('drwxr-xr-x  5 guest staff  4096 Jun 14 13:00 ..', 'output-info');
            logOutput('-rw-r--r--  1 guest staff   512 Jun 14 13:00 rogue_ap.txt', 'text-main');
            logOutput('-rw-r--r--  1 guest staff   384 Jun 14 13:00 spycam.txt', 'text-main');
            logOutput('-rw-r--r--  1 guest staff   256 Jun 14 13:00 wireshark.txt', 'text-main');
            break;

        case 'matrix':
            themeToggle.click();
            logOutput('Theme configuration manipulated via core console engine.', 'output-success');
            break;

        case 'ctf':
            startCtfGameEngine();
            break;

        case 'hack':
            runNetworkLoadingSequence();
            break;
            
        case 'clear':
            terminalOutput.innerHTML = '';
            break;
            
        default:
            logOutput(`Unknown command configuration syntax: '${cmd}'. Type 'help' to review directory flags.`, 'output-error');
    }
}

function handleCatCommands(filename) {
    switch(filename) {
        case 'wireshark.txt':
            logOutput('[+] PCAP ANALYTICS LOG OUT:', 'output-success');
            logOutput('Anomalous POST strings tracking pinpointed active C2 listening channels inside streams.');
            break;
        case 'rogue_ap.txt':
            logOutput('[+] ROGUE ACCESS POINT ANALYSIS:', 'output-success');
            logOutput('Pyle Station AP broadcasted a random SSID with no internet access. Blocked client devices within 3 minutes using targeted deauth frames.');
            break;
        case 'spycam.txt':
            logOutput('[+] COVERT SURVEILLANCE REPORT:', 'output-success');
            logOutput('Isolated suspicious unmapped BSSID operating near Pyle Asda / Fire Station. Signatures closely match an A9 hidden micro-camera module.');
            break;
        default:
            logOutput(`Error: file '${filename}' not found under current operations partition.`, 'output-error');
    }
}
// 7. MINI CTF GAME SYSTEM LOGIC
function startCtfGameEngine() {
    ctfActive = true;
    currentCtfLevel = 1;
    logOutput('====================================================', 'output-secret');
    logOutput('[!] INITIALISING OPERATIONS CTF LAB CHAMBER...', 'output-secret');
    logOutput('Type your answers directly into the prompt. Type "exit" to quit.', 'output-info');
    logOutput('====================================================', 'output-secret');
    loadCtfLevelPrompt();
}

function loadCtfLevelPrompt() {
    if (currentCtfLevel === 1) {
        logOutput('\n[+] CTF LEVEL 1: Cryptography Defenses', 'output-info');
        logOutput('Our intelligence intercepted an obfuscated base64 payload transmission string:');
        logOutput('     "U3BlY3RydW1fU2VjdXJlXzIwMjY="', 'text-main');
        logOutput('Decode the base64 string to find the plaintext access passphrase key token:');
    } else if (currentCtfLevel === 2) {
        logOutput('\n[+] CTF LEVEL 2: Log Forensic Incident Analysis', 'output-info');
        logOutput('Review this snippet of an internal database firewall intrusion log dump:');
        logOutput('  [10:14:02] 192.168.1.105 - GET /index.php HTTP/1.1 - 200 OK');
        logOutput('  [10:14:15] 10.0.0.42     - POST /login.php HTTP/1.1 - 401 Unauthorized');
        logOutput('  [10:15:22] 192.168.88.7  - GET /products.php?id=1\'%20OR%20\'1\'=\'1 HTTP/1.1 - 500 Internal Error');
        logOutput('Identify the source IP address executing the dynamic SQL Injection (SQLi) vector attack query:');
    } else if (currentCtfLevel === 3) {
        logOutput('\n[+] CTF LEVEL 3: Privilege Escalation Bounds', 'output-info');
        logOutput('You have achieved local low-privilege user access. Typing "sudo -l" returns the following:');
        logOutput('  User guest may run the following commands on host-node:');
        logOutput('     (ALL) NOPASSWD: /usr/bin/env');
        logOutput('What parameter flag command argument string should you chain to "/usr/bin/env" to spawn an unrestricted root shell? (Hint: standard UNIX system executable terminal prompt shorthand name)', 'output-info');
    }
}

function handleCtfInput(guess) {
    const standardizedCleanGuess = guess.trim();
    if (standardizedCleanGuess.toLowerCase() === 'exit') {
        logOutput('[!] Aborting operational test sandbox.', 'output-error');
        ctfActive = false;
        currentCtfLevel = 0;
        return;
    }

    if (currentCtfLevel === 1) {
        if (standardizedCleanGuess === "Spectrum_Secure_2026") {
            logOutput('[+] CORRECT! Token Found: FLAG{B4U_D3C0D3_M4ST3R}', 'output-success');
            currentCtfLevel = 2;
            loadCtfLevelPrompt();
        } else {
            logOutput('[-] INVALID TOKEN HASH. Decoding translation failure. Try again (or type "exit"):', 'output-error');
        }
    } else if (currentCtfLevel === 2) {
        if (standardizedCleanGuess === "192.168.88.7") {
            logOutput('[+] CORRECT! Threat actor vector traced. Token Found: FLAG{L0G_VI3W_F0R3NS1CS}', 'output-success');
            currentCtfLevel = 3;
            loadCtfLevelPrompt();
        } else {
            logOutput('[-] SEARCH TRAFFIC ERRANT. That host node is legitimate traffic. Try again:', 'output-error');
        }
    } else if (currentCtfLevel === 3) {
        if (standardizedCleanGuess === "/bin/sh" || standardizedCleanGuess === "/bin/bash" || standardizedCleanGuess === "sh" || standardizedCleanGuess === "bash") {
            logOutput('[+] SUCCESS! Root access achieved. System fully compromised.', 'output-success');
            logOutput('====================================================', 'output-secret');
            logOutput('FLAG{ROOT_PR1VS_POPP3D_ESP32_E1GHT}', 'output-secret');
            logOutput('Congratulations, Operator. All sandbox CTF parameters passed.', 'output-success');
            logOutput('====================================================', 'output-secret');
            ctfActive = false;
            currentCtfLevel = 0;
        } else {
            logOutput('[-] SHELL INCOMPATIBLE. Binary execution failed to trigger root bounds. Try again:', 'output-error');
        }
    }
}

// 8. INTERACTIVE STAGGERED NETWORK PING ENGINE
function executePingSequence(host) {
    if (!host) {
        logOutput('Usage: ping [hostname_or_ip_target]', 'output-error');
        return;
    }
    systemLocked = true;
    terminalInput.disabled = true;
    logOutput(`PING ${host} (192.168.1.45) 56(84) bytes of data data stream.`);
    
    let currentSequenceCount = 0;
    const maxPingRuns = 4;

    function runPingLoop() {
        if (currentSequenceCount < maxPingRuns) {
            currentSequenceCount++;
            const randomLatencyMs = (Math.random() * 14 + 4).toFixed(1);
            logOutput(`64 bytes from ${host} (192.168.1.45): icmp_seq=${currentSequenceCount} ttl=64 time=${randomLatencyMs} ms`, 'text-main');
            setTimeout(runPingLoop, 800); 
        } else {
            logOutput(`--- ${host} ping statistics ---`, 'output-info');
            logOutput(`${maxPingRuns} packets transmitted, ${maxPingRuns} received, 0% packet loss, time 2404ms`, 'output-info');
            logOutput('rtt min/avg/max/mdev = 4.2/11.5/18.4/3.1 ms', 'output-info');
            systemLocked = false;
            terminalInput.disabled = false;
            terminalInput.focus();
        }
    }
    setTimeout(runPingLoop, 800);
}

// 9. PROGRESS METER UTILITY DRIVER (FIREWALL COMPROMISE GAME)
function runNetworkLoadingSequence() {
    systemLocked = true;
    terminalInput.disabled = true;
    logOutput('[!] INITIALISING FIREWALL EXPLOITATION VECTOR...', 'output-secret');
    logOutput('Connecting to remote target proxy gateway...', 'output-info');
    
    setTimeout(() => {
        const progressLineElement = logOutput('[--------------------] 0%');
        let currentProgressWidth = 0;
        const totalTargetSteps = 20;

        const progressIntervalTimer = setInterval(() => {
            currentProgressWidth++;
            const computedPercentage = Math.round((currentProgressWidth / totalTargetSteps) * 100);
            
            const completedBlocks = '#'.repeat(currentProgressWidth);
            const remainingDashes = '-'.repeat(totalTargetSteps - currentProgressWidth);
            
            progressLineElement.textContent = `[${completedBlocks}${remainingDashes}] ${computedPercentage}%`;
            progressLineElement.className = 'output-secret';
            document.getElementById('terminal').scrollTop = document.getElementById('terminal').scrollHeight;

            if (currentProgressWidth >= totalTargetSteps) {
                clearInterval(progressIntervalTimer);
                triggerPostLoadAlerts();
            }
        }, 120);
    }, 800);
}

function triggerPostLoadAlerts() {
    logOutput('[+] INTRUSION PIPELINE ESTABLISHED SUCCESSFULLY.', 'output-success');
    const alertBanner = logOutput('!!! BYPASSING MULTI-FACTOR PERMISSIONS CORE !!!', 'output-error');
    
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        alertBanner.style.visibility = (alertBanner.style.visibility === 'hidden') ? 'visible' : 'hidden';
        flashCount++;
        if (flashCount >= 6) {
            clearInterval(flashInterval);
            alertBanner.style.visibility = 'visible';
            
            gameActive = true;
            systemLocked = false;
            terminalInput.disabled = false;
            
            logOutput('----------------------------------------------------');
            logOutput('Target security layer compromised. Credentials required.', 'output-info');
            logOutput('Hint: Most common default admin account handle username.', 'output-info');
            logOutput('Enter Passphrase Guess:');
            terminalInput.focus();
        }
    }, 200);
}
