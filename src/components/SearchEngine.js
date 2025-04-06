import React, { useState } from "react";

const mockResults = [
    { title: "React Documentation", url: "https://react.dev" },
    { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
    { title: "OpenAI", url: "https://openai.com" },
    { title: "Tailwind CSS", url: "https://tailwindcss.com" },
];

export default function SimpleSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = () => {
        const filteredResults = mockResults.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <h1
                style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "16px",
                }}
            >
                Simple Search
            </h1>
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    borderRadius: "4px",
                    width: "320px",
                }}
            />
            <button
                onClick={handleSearch}
                style={{
                    marginTop: "8px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                }}
            >
                Search
            </button>
            <div style={{ marginTop: "16px", width: "320px" }}>
                {results.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            borderBottom: "1px solid #ddd",
                            padding: "8px 0",
                        }}
                    >
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#007BFF", textDecoration: "none" }}
                        >
                            {item.title}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
