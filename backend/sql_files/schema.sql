CREATE TABLE ticket (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_type TEXT DEFAULT "",
    project TEXT DEFAULT "",
    reporter TEXT DEFAULT "",
    assign TEXT DEFAULT "",
    ticket_priority TEXT DEFAULT "Medium",
    summary TEXT NOT NULL,
    ticket_description TEXT NOT NULL,
    create_date CURRENT_TIMESTAMP,
    resolution TEXT,
    ticket_status TEXT DEFAULT "Pending"
);

CREATE TABLE code_review (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT DEFAULT "",
    reviewer TEXT DEFAULT "",
    branch TEXT DEFAULT "",
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    code_review_status TEXT DEFAULT "Pending"
);