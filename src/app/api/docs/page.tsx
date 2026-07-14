"use client";

import { useState } from "react";
import Link from "next/link";
import { Terminal, Send, ArrowRight, Play, CheckCircle2, Copy, Loader2 } from "lucide-react";

interface EndpointInfo {
  method: "GET" | "POST";
  path: string;
  desc: string;
  queryParams?: { name: string; type: string; desc: string; placeholder?: string }[];
  pathParams?: { name: string; type: string; desc: string; placeholder?: string }[];
}

const ENDPOINTS: EndpointInfo[] = [
  {
    method: "GET",
    path: "/api/v1/posts",
    desc: "Exposes paginated published blog posts. Supports categories, tags, search queries, and sorting parameters.",
    queryParams: [
      { name: "page", type: "number", desc: "Page offset index", placeholder: "1" },
      { name: "limit", type: "number", desc: "Count of items per page", placeholder: "10" },
      { name: "category", type: "string", desc: "Category filter (name)", placeholder: "Development" },
      { name: "tag", type: "string", desc: "Tag filter (name)", placeholder: "React" },
      { name: "search", type: "string", desc: "Scan title and excerpt keywords", placeholder: "Optimize" },
      { name: "sortBy", type: "string", desc: "Sort fields (publishedAt | views | title)", placeholder: "publishedAt" },
      { name: "fields", type: "string", desc: "Comma-separated columns select (e.g. title,slug)", placeholder: "title,slug" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/posts/{slug}",
    desc: "Exposes full article body matching slug URL parameter.",
    pathParams: [
      { name: "slug", type: "string", desc: "Unique post url slug identifier", placeholder: "hello-world" },
    ],
  },
  {
    method: "GET",
    path: "/api/v1/categories",
    desc: "Exposes all categories alphabetically, listing total published posts counts.",
  },
  {
    method: "GET",
    path: "/api/v1/tags",
    desc: "Exposes all tags alphabetically, listing total published posts counts.",
  },
  {
    method: "GET",
    path: "/api/v1/authors",
    desc: "Exposes author collaborator profiles listing published counts.",
  },
  {
    method: "GET",
    path: "/api/v1/search",
    desc: "Scans posts titles, excerpts, and markdown body fields.",
    queryParams: [
      { name: "q", type: "string", desc: "Search keywords query parameter (Required)", placeholder: "Nextjs" },
    ],
  },
];

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState<number>(0);
  const [queryInputs, setQueryInputs] = useState<Record<string, string>>({});
  const [pathInputs, setPathInputs] = useState<Record<string, string>>({});
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTest = async (endpoint: EndpointInfo) => {
    setLoading(true);
    setApiResponse(null);

    // Resolve path parameters
    let finalPath = endpoint.path;
    if (endpoint.pathParams) {
      endpoint.pathParams.forEach((param) => {
        const val = pathInputs[param.name] || param.placeholder || "";
        finalPath = finalPath.replace(`{${param.name}}`, val);
      });
    }

    // Resolve query parameters
    const params = new URLSearchParams();
    if (endpoint.queryParams) {
      endpoint.queryParams.forEach((param) => {
        const val = queryInputs[param.name] || "";
        if (val) {
          params.append(param.name, val);
        }
      });
    }

    const queryString = params.toString();
    const finalUrl = `${window.location.origin}${finalPath}${queryString ? `?${queryString}` : ""}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    try {
      const res = await fetch(finalUrl, { headers });
      const data = await res.json();
      setApiResponse({
        status: res.status,
        headers: Array.from(res.headers.entries()),
        body: data,
      });
    } catch (e: any) {
      setApiResponse({ error: e.message || "Failed to query API endpoint" });
    }
    setLoading(false);
  };

  const activeEp = ENDPOINTS[activeEndpoint];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans flex flex-col antialiased select-none">
      {/* Header navbar */}
      <header className="border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 px-6 py-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-zinc-100" />
          <span className="text-sm font-extrabold text-zinc-50 uppercase tracking-wider">
            LogBook HEADLESS REST API Explorer v1
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Authorization Bearer Token..."
            className="w-64 px-3 py-1.5 border border-zinc-900 bg-zinc-950 rounded-xl text-xs text-zinc-50 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-100"
          />
        </div>
      </header>

      {/* Main split dashboard */}
      <div className="flex-1 grid md:grid-cols-[280px_1fr_400px] h-0 overflow-y-auto">
        {/* Sidebar list endpoints */}
        <aside className="border-r border-zinc-900 p-6 space-y-4 bg-zinc-950/20">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Exposed API Endpoints
          </h3>
          <div className="space-y-1.5">
            {ENDPOINTS.map((ep, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveEndpoint(idx);
                  setApiResponse(null);
                  setQueryInputs({});
                  setPathInputs({});
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all flex flex-col gap-1 cursor-pointer ${
                  activeEndpoint === idx
                    ? "bg-zinc-900 border-zinc-800 text-zinc-50"
                    : "border-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase">
                    {ep.method}
                  </span>
                  <span className="text-[10px] font-mono truncate">{ep.path}</span>
                </div>
                <p className="text-[10px] text-zinc-500 truncate leading-relaxed">
                  {ep.desc}
                </p>
              </button>
            ))}
          </div>
        </aside>

        {/* Center Panel: Parameters & Runner */}
        <main className="p-8 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">
                {activeEp.method}
              </span>
              <h2 className="text-base font-mono font-bold text-zinc-50 select-text">
                {activeEp.path}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {activeEp.desc}
            </p>
          </div>

          {/* Path Parameter Inputs */}
          {activeEp.pathParams && (
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Path Parameters
              </h3>
              <div className="space-y-3.5">
                {activeEp.pathParams.map((p) => (
                  <div key={p.name} className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <span className="text-xs font-mono text-zinc-400">
                      {p.name} <span className="text-rose-500 font-bold">*</span>
                    </span>
                    <input
                      type="text"
                      value={pathInputs[p.name] || ""}
                      onChange={(e) => setPathInputs({ ...pathInputs, [p.name]: e.target.value })}
                      placeholder={p.placeholder}
                      className="px-3 py-1.5 border border-zinc-900 bg-zinc-950 rounded-xl text-xs text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query Parameter Inputs */}
          {activeEp.queryParams && (
            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Query Parameters
              </h3>
              <div className="space-y-3.5">
                {activeEp.queryParams.map((p) => (
                  <div key={p.name} className="grid grid-cols-[120px_1fr] items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono text-zinc-400 block">{p.name}</span>
                      <span className="text-[9px] text-zinc-500 block italic">{p.type}</span>
                    </div>
                    <input
                      type="text"
                      value={queryInputs[p.name] || ""}
                      onChange={(e) => setQueryInputs({ ...queryInputs, [p.name]: e.target.value })}
                      placeholder={p.placeholder}
                      className="px-3 py-1.5 border border-zinc-900 bg-zinc-950 rounded-xl text-xs text-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Play Runner Button */}
          <div className="pt-6 border-t border-zinc-900">
            <button
              onClick={() => runTest(activeEp)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>Execute Sandbox Request</span>
            </button>
          </div>
        </main>

        {/* Right Panel: Interactive Playground JSON responses */}
        <aside className="border-l border-zinc-900 bg-black/25 flex flex-col h-full overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              JSON Output Console
            </h3>
            {apiResponse && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wide">
                Status {apiResponse.status}
              </span>
            )}
          </div>

          <div className="flex-grow bg-zinc-950 border border-zinc-900 rounded-2xl p-4 overflow-auto font-mono text-[11px] leading-relaxed select-text">
            {apiResponse ? (
              <pre className="text-zinc-300">
                {JSON.stringify(apiResponse.body || apiResponse, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-650 italic text-center text-xs">
                Run sandbox request execution to inspect JSON response logs.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";
