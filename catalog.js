const attackCatalog = [
    { name: "Phishing Attack", cost: 100 },
    { name: "SQL Injection", cost: 250 },
    { name: "DDoS Attack", cost: 300 },
    { name: "Spoofing", cost: 150 },
    { name: "Man-in-the-Middle", cost: 250 },
    { name: "XSS (Cross-Site Scripting)", cost: 200 },
    { name: "Social Engineering", cost: 100 },
    { name: "Physical Security Flaw", cost: 300 },
    { name: "Weak Configuration/Permissions", cost: 150 },
    { name: "Lack of Awareness", cost: 50 },
    { name: "Insecure Wifi", cost: 200 },
    { name: "Zero Day Exploit", cost: 400 },
    { name: "Default Attack", cost: 0 } // Default attack (this is hidden)
];

const defenseCatalog = [
    { name: "Anti-Phishing Training", cost: 100, counter: "Phishing Attack", effectiveness: "high" },
    { name: "SQL Injection Filter", cost: 250, counter: "SQL Injection", effectiveness: "high" },
    { name: "DDoS Protection", cost: 300, counter: "DDoS Attack", effectiveness: "high" },
    { name: "Email Authentication", cost: 150, counter: "Spoofing", effectiveness: "high" },
    { name: "Encrypted Communications", cost: 250, counter: "Man-in-the-Middle", effectiveness: "high" },
    { name: "XSS Prevention Tools", cost: 200, counter: "XSS (Cross-Site Scripting)", effectiveness: "high" },
    { name: "Security Awareness Training", cost: 100, counter: "Social Engineering", effectiveness: "high" },
    { name: "Physical Security Measures", cost: 300, counter: "Physical Security Flaw", effectiveness: "high" },
    { name: "Configuration Management", cost: 150, counter: "Weak Configuration/Permissions", effectiveness: "high" },
    { name: "Employee Training Programs", cost: 50, counter: "Lack of Awareness", effectiveness: "high" },
    { name: "Secure Wifi Setup", cost: 200, counter: "Insecure Wifi", effectiveness: "high" },
    { name: "Patch Management", cost: 400, counter: "Zero Day Exploit", effectiveness: "high" },
    { name: "Default Defense", cost: 0, effectiveness: "low" } // Default defense (this is hidden)
];
