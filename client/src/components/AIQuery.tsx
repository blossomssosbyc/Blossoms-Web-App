import React, { useState } from "react";
import { Send, Loader, AlertCircle } from "lucide-react";

interface AIQueryProps {
  data: { [key: string]: string }[];
}

interface QueryResult {
  answer: string;
  confidence: number;
  dataPoints: number;
  queryType?: string;
}

// NLP utilities for query understanding
const NLP = {
  // Intent classification with fuzzy matching support
  intents: {
    COUNT: [
      "how many",
      "count",
      "total",
      "number of",
      "how much",
      "what is the total",
      "give me the total",
      "tell me how many",
      "how many are",
      "what's the count",
    ],
    SEARCH: [
      "find",
      "who",
      "which",
      "search",
      "get",
      "show me",
      "list",
      "where is",
      "tell me about",
      "information about",
      "details of",
      "give me",
    ],
    AGGREGATE: [
      "average",
      "avg",
      "mean",
      "median",
      "most",
      "least",
      "top",
      "best",
      "worst",
      "highest",
      "lowest",
      "popular",
      "common",
      "frequent",
      "majority",
    ],
    COMPARE: [
      "compare",
      "vs",
      "versus",
      "difference",
      "different",
      "between",
      "contrast",
      "which is better",
      "how do they differ",
    ],
    FILTER: [
      "where",
      "in",
      "from",
      "class",
      "department",
      "event",
      "registered for",
      "belongs to",
      "part of",
      "members of",
    ],
    TREND: [
      "trend",
      "increase",
      "decrease",
      "growth",
      "change",
      "over time",
      "history",
      "progress",
    ],
    DISTRIBUTION: [
      "distribution",
      "breakdown",
      "split",
      "proportion",
      "percentage",
      "ratio",
      "spread",
      "how are they distributed",
    ],
    STATS: [
      "statistics",
      "stats",
      "data",
      "information",
      "details",
      "analysis",
      "report",
      "overview",
    ],
  },

  // Fuzzy string matching for better vague query handling
  similarityScore(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1.0;

    const editDistance = NLP.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  },

  // Calculate edit distance for fuzzy matching
  getEditDistance(s1: string, s2: string): number {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  },

  // Extract intent from query with confidence scoring
  extractIntent(query: string): string[] {
    const lower = query.toLowerCase();
    const foundIntents: { intent: string; confidence: number }[] = [];

    for (const [intent, keywords] of Object.entries(this.intents)) {
      let maxConfidence = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          maxConfidence = 1.0;
          break;
        }
        // Fuzzy matching for partial matches
        const words = lower.split(/\s+/);
        for (const word of words) {
          if (word.length > 3) {
            const similarity = this.similarityScore(word, kw);
            maxConfidence = Math.max(maxConfidence, similarity);
          }
        }
      }

      if (maxConfidence > 0.7) {
        foundIntents.push({ intent, confidence: maxConfidence });
      }
    }

    // Sort by confidence and return top intents
    const result = foundIntents
      .sort((a, b) => b.confidence - a.confidence)
      .map((i) => i.intent);

    return result.length > 0 ? result : ["GENERAL"];
  },

  // Extract entities (what the user is asking about)
  extractEntities(query: string): { type: string; value: string }[] {
    const entities: { type: string; value: string }[] = [];
    const lower = query.toLowerCase();

    // Class patterns - handle various formats
    const classMatch = lower.match(/\b([0-9]+\s*[a-z]+\s*[a-z]?)\b/gi);
    if (classMatch) {
      entities.push({ type: "CLASS", value: classMatch[0].toUpperCase() });
    }

    // Event names - expanded list
    const commonEvents = [
      "photography",
      "photo",
      "debate",
      "extempore",
      "pot art",
      "dance",
      "music",
      "coding",
      "design",
      "sketch",
      "drama",
      "speech",
      "performance",
      "presentation",
      "workshop",
      "competition",
      "contest",
    ];
    commonEvents.forEach((event) => {
      if (lower.includes(event)) {
        entities.push({ type: "EVENT", value: event });
      }
    });

    // Department patterns - expanded
    const deptMatch = lower.match(
      /\b(bca|ems|mds|bsc|ba|msc|science|commerce|arts)\b/gi
    );
    if (deptMatch) {
      entities.push({ type: "DEPARTMENT", value: deptMatch[0].toUpperCase() });
    }

    // Participant/Person type references
    if (
      lower.includes("participant") ||
      lower.includes("student") ||
      lower.includes("person") ||
      lower.includes("people") ||
      lower.includes("member") ||
      lower.includes("attendee")
    ) {
      entities.push({ type: "PARTICIPANT", value: "PARTICIPANT" });
    }

    // Vague references that should trigger statistics
    if (
      lower.includes("everything") ||
      lower.includes("all") ||
      lower.includes("overall") ||
      lower.includes("general") ||
      lower.includes("summary")
    ) {
      entities.push({ type: "VAGUE_REF", value: "ALL_DATA" });
    }

    return entities;
  },

  // Sentiment/modifier extraction
  extractModifiers(query: string): {
    hasLimit?: boolean;
    limit?: number;
    hasSort?: boolean;
    sortType?: string;
  } {
    const lower = query.toLowerCase();
    const modifiers: any = {};

    // Check for limits
    const limitMatch = lower.match(
      /(\d+)\s*(top|first|last|best|highest|lowest)/
    );
    if (limitMatch) {
      modifiers.hasLimit = true;
      modifiers.limit = parseInt(limitMatch[1]);
      modifiers.hasSort = true;
      modifiers.sortType = limitMatch[2];
    }

    return modifiers;
  },
};

// Enhanced query processor with NLP
function processQuery(query: string, data: AIQueryProps["data"]): QueryResult {
  const lowerQuery = query.toLowerCase();
  let answer = "";
  let dataPoints = 0;
  let queryType = "";

  // Extract query components using NLP
  const intents = NLP.extractIntent(query);
  const entities = NLP.extractEntities(query);
  const modifiers = NLP.extractModifiers(query);

  queryType = intents.join(" + ");

  // Handle COUNT intent
  if (intents.includes("COUNT")) {
    if (lowerQuery.includes("participant") || lowerQuery.includes("student")) {
      const count = data.length;
      answer = `There are ${count} total participants in the system.`;
      dataPoints = count;
    } else if (lowerQuery.includes("class") && !lowerQuery.includes("in")) {
      const classes = new Set(data.map((r) => r["Class"]).filter(Boolean));
      answer = `There are ${
        classes.size
      } unique classes registered: ${Array.from(classes)
        .slice(0, 5)
        .join(", ")}${
        classes.size > 5 ? `, and ${classes.size - 5} more` : ""
      }`;
      dataPoints = classes.size;
    } else if (lowerQuery.includes("event")) {
      const events = new Set();
      data.forEach((r) => {
        const evts = (r["Event(s) Registered"] || "").split(",");
        evts.forEach((e) => events.add(e.trim()));
      });
      answer = `There are ${events.size} unique events across the school.`;
      dataPoints = events.size;
    } else if (lowerQuery.includes("department")) {
      const depts = new Set();
      data.forEach((r) => {
        const classStr = r["Class"] || "";
        const match = classStr.match(/\b([A-Z]+)\b/);
        if (match) depts.add(match[1]);
      });
      answer = `There are ${depts.size} departments: ${Array.from(depts).join(
        ", "
      )}`;
      dataPoints = depts.size;
    } else {
      answer = `There are ${data.length} total records in the database.`;
      dataPoints = data.length;
    }
  }

  // Handle SEARCH intent
  else if (intents.includes("SEARCH")) {
    // If entity is CLASS, search in that class
    if (entities.some((e) => e.type === "CLASS")) {
      const classEntity = entities.find((e) => e.type === "CLASS")?.value || "";
      const results = data.filter((r) =>
        r["Class"]?.toUpperCase().includes(classEntity)
      );
      if (results.length > 0) {
        const names = results.slice(0, 5).map((r) => r["Name"]);
        answer = `Found ${results.length} participant${
          results.length !== 1 ? "s" : ""
        } in ${classEntity}: ${names.join(", ")}${
          results.length > 5 ? `, and ${results.length - 5} more` : ""
        }`;
        dataPoints = results.length;
      } else {
        answer = `No participants found in class ${classEntity}.`;
        dataPoints = 0;
      }
    }
    // Generic search
    else {
      const searchTerm = query.split(/\s+/).pop()?.toLowerCase() || "";
      const results = data.filter(
        (r) =>
          r["Name"]?.toLowerCase().includes(searchTerm) ||
          r["Class"]?.toLowerCase().includes(searchTerm)
      );

      if (results.length > 0) {
        answer = `Found ${results.length} match${
          results.length > 1 ? "es" : ""
        }: ${results
          .slice(0, 3)
          .map((r) => `${r["Name"]} from ${r["Class"]}`)
          .join(", ")}${
          results.length > 3 ? `, and ${results.length - 3} more` : ""
        }`;
        dataPoints = results.length;
      } else {
        answer = `No participants found matching "${searchTerm}".`;
        dataPoints = 0;
      }
    }
  }

  // Handle AGGREGATE intent (top, best, average, etc.)
  else if (intents.includes("AGGREGATE")) {
    if (lowerQuery.includes("average") || lowerQuery.includes("avg")) {
      const uniqueParticipants = new Set(
        data.map((r) => r["Christ Email"]).filter(Boolean)
      );
      const avgEventsPerParticipant = (
        data.length / uniqueParticipants.size
      ).toFixed(2);
      answer = `On average, each participant is registered for ${avgEventsPerParticipant} events.`;
      dataPoints = parseInt(avgEventsPerParticipant);
    } else if (
      lowerQuery.includes("top") ||
      lowerQuery.includes("best") ||
      lowerQuery.includes("highest")
    ) {
      const limit = modifiers.limit || 5;
      const eventCounts: { [key: string]: number } = {};
      data.forEach((r) => {
        const events = (r["Event(s) Registered"] || "").split(",");
        events.forEach((e) => {
          const event = e.trim();
          eventCounts[event] = (eventCounts[event] || 0) + 1;
        });
      });

      const sorted = Object.entries(eventCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

      answer = `Top ${limit} most popular events: ${sorted
        .map(
          ([name, count]) =>
            `${name} (${count} registration${count !== 1 ? "s" : ""})`
        )
        .join(", ")}`;
      dataPoints = sorted.length;
    } else if (lowerQuery.includes("worst") || lowerQuery.includes("lowest")) {
      const limit = modifiers.limit || 5;
      const eventCounts: { [key: string]: number } = {};
      data.forEach((r) => {
        const events = (r["Event(s) Registered"] || "").split(",");
        events.forEach((e) => {
          const event = e.trim();
          eventCounts[event] = (eventCounts[event] || 0) + 1;
        });
      });

      const sorted = Object.entries(eventCounts)
        .sort(([, a], [, b]) => a - b)
        .slice(0, limit);

      answer = `Least popular events: ${sorted
        .map(
          ([name, count]) =>
            `${name} (${count} registration${count !== 1 ? "s" : ""})`
        )
        .join(", ")}`;
      dataPoints = sorted.length;
    }
  }

  // Handle FILTER + CLASS specific intent
  else if (
    intents.includes("FILTER") &&
    entities.some((e) => e.type === "CLASS")
  ) {
    const classEntity = entities.find((e) => e.type === "CLASS")?.value || "";
    const classData = data.filter((r) =>
      r["Class"]?.toUpperCase().includes(classEntity)
    );
    const eventSet = new Set();
    classData.forEach((r) => {
      const events = (r["Event(s) Registered"] || "").split(",");
      events.forEach((e) => eventSet.add(e.trim()));
    });

    answer = `Class ${classEntity} has ${
      classData.length
    } participants registered for ${
      eventSet.size
    } different events: ${Array.from(eventSet).slice(0, 3).join(", ")}${
      eventSet.size > 3 ? `, and ${eventSet.size - 3} more` : ""
    }`;
    dataPoints = classData.length;
  }

  // Handle DISTRIBUTION intent
  else if (intents.includes("DISTRIBUTION")) {
    const deptMap: { [key: string]: number } = {};
    data.forEach((r) => {
      const classStr = r["Class"] || "";
      const match = classStr.match(/\b([A-Z]+)\b/);
      if (match) {
        deptMap[match[1]] = (deptMap[match[1]] || 0) + 1;
      }
    });

    const sorted = Object.entries(deptMap).sort(([, a], [, b]) => b - a);
    answer = `Participant distribution across departments: ${sorted
      .map(
        ([dept, count]) =>
          `${dept} (${count} - ${((count / data.length) * 100).toFixed(1)}%)`
      )
      .join(", ")}`;
    dataPoints = sorted.length;
  }

  // Handle STATS intent - general statistics queries
  else if (intents.includes("STATS")) {
    const uniqueParticipants = new Set(
      data.map((r) => r["Christ Email"]).filter(Boolean)
    );
    const classes = new Set(data.map((r) => r["Class"]).filter(Boolean));
    const events = new Set();
    data.forEach((r) => {
      const evts = (r["Event(s) Registered"] || "").split(",");
      evts.forEach((e) => events.add(e.trim()));
    });
    const depts = new Set();
    data.forEach((r) => {
      const classStr = r["Class"] || "";
      const match = classStr.match(/\b([A-Z]+)\b/);
      if (match) depts.add(match[1]);
    });

    answer = `Here's an overview: ${uniqueParticipants.size} unique participants, ${classes.size} classes, ${events.size} different events, across ${depts.size} departments. Total registrations: ${data.length}.`;
    dataPoints = data.length;
  }

  // Smart vague query handler - infer intent from context
  else if (intents.includes("GENERAL") || intents.length === 0) {
    // Check for vague references that mean "give me everything"
    if (entities.some((e) => e.type === "VAGUE_REF")) {
      const classes = new Set(data.map((r) => r["Class"]).filter(Boolean));
      const events = new Set();
      data.forEach((r) => {
        const evts = (r["Event(s) Registered"] || "").split(",");
        evts.forEach((e) => events.add(e.trim()));
      });
      answer = `Complete overview: ${data.length} total registrations from ${
        new Set(data.map((r) => r["Name"])).size
      } participants across ${classes.size} classes in ${events.size} events.`;
      dataPoints = data.length;
    }
    // Check if query seems to be asking about a specific class even without clear intent
    else if (/\b([0-9]+\s*[a-z]+\s*[a-z]?)\b/gi.test(query)) {
      const classMatch = query.match(/\b([0-9]+\s*[a-z]+\s*[a-z]?)\b/gi);
      if (classMatch) {
        const classStr = classMatch[0].toUpperCase();
        const classData = data.filter((r) =>
          r["Class"]?.toUpperCase().includes(classStr)
        );
        const eventSet = new Set();
        classData.forEach((r) => {
          const events = (r["Event(s) Registered"] || "").split(",");
          events.forEach((e) => eventSet.add(e.trim()));
        });
        answer = `Class ${classStr}: ${
          classData.length
        } participants registered for ${
          eventSet.size
        } events. Notable events: ${Array.from(eventSet)
          .slice(0, 4)
          .join(", ")}${
          eventSet.size > 4 ? `, and ${eventSet.size - 4} more` : ""
        }.`;
        dataPoints = classData.length;
      } else {
        answer =
          "I can help you query the database! Try asking: 'How many participants?', 'What classes are there?', 'Tell me about 2 BCA A', 'Show top events', or 'Overall statistics'";
        dataPoints = 0;
      }
    }
    // Fallback: suggest helpful queries
    else {
      answer =
        "I can help you with the database! Try: 'Total participants?', 'Classes?', 'Top 5 events', 'Department breakdown', 'Tell me about 2 BCA A', or 'Overall statistics'";
      dataPoints = 0;
    }
  }

  // Default fallback
  else {
    answer =
      "I can help you query the database! Try asking: 'How many participants?', 'What classes are there?', 'Who is in 2 BCA A?', 'Show me top 5 events', 'Distribution by department'";
    dataPoints = 0;
  }

  return {
    answer,
    confidence: Math.min(0.95, 0.5 + (dataPoints > 0 ? 0.45 : 0)),
    dataPoints,
    queryType,
  };
}

export default function AIQuery({ data }: AIQueryProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { query: string; result: QueryResult; timestamp: Date }[]
  >([]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    // Simulate processing delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = processQuery(query, data);
    setResults(result);
    setHistory((prev) => [
      { query, result, timestamp: new Date() },
      ...prev.slice(0, 9), // Keep last 10 queries
    ]);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleQuery();
    }
  };

  return (
    <div className="space-y-8">
      {/* Query Input */}
      <section data-reveal>
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3 mb-2">
            <span className="w-1 h-10 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full" />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Database Query
            </span>
          </h2>
          <p className="text-white/60 mt-2">
            Ask questions about the participant database and get instant answers
          </p>
        </div>

        <div className="bg-gradient-to-r from-[#0b0713] to-[#000000] border border-[rgba(57,46,78,0.6)] rounded-2xl p-8 backdrop-blur-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question... (e.g., 'How many participants?', 'What are the top events?')"
              className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-purple-500/30 text-white placeholder-white/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              disabled={loading}
            />
            <button
              onClick={handleQuery}
              disabled={loading || !query.trim()}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Send size={18} />
                  Query
                </>
              )}
            </button>
          </div>

          {/* Example Queries */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-wide">
              Try these queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "How many participants total?",
                "Show top 5 events",
                "Who is in 2 BCA A?",
                "What's the distribution by department?",
                "Average events per student",
                "Find least popular events",
                "List all classes",
                "Participant count comparison",
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/20 text-white/70 hover:bg-white/10 hover:border-blue-400/50 hover:text-blue-300 transition-all duration-300"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      {results && (
        <section data-reveal>
          <div className="bg-gradient-to-r from-[#0b0713] to-[#000000] border border-[rgba(57,46,78,0.6)] rounded-2xl p-8 backdrop-blur-xl">
            <div className="space-y-4">
              {/* Query Type Badge */}
              {results.queryType && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {results.queryType.split(" + ").map((type) => (
                    <span
                      key={type}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 text-blue-300"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Query Result
                  </h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {results.answer}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-white/60 mb-2">Confidence</div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${results.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-cyan-400 whitespace-nowrap">
                      {(results.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {results.dataPoints > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <AlertCircle size={16} />
                    <span>
                      Result based on {results.dataPoints} data point
                      {results.dataPoints !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Query History */}
      {history.length > 0 && (
        <section data-reveal>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white">Query History</h3>
          </div>

          <div className="grid gap-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-[#0b0713] to-[#000000] border border-[rgba(57,46,78,0.6)] rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setQuery(item.query)}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-white font-semibold">{item.query}</p>
                  <span className="text-xs text-white/40">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white/60 text-sm line-clamp-2">
                  {item.result.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
