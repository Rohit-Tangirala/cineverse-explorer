import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import axios from 'axios';
import { Loader2, Search, AlertTriangle } from 'lucide-react';

export default function GraphView() {
  const { universe } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<any>>(new DataSet());
  const edgesDataSetRef = useRef<DataSet<any>>(new DataSet());
  
  const [loading, setLoading] = useState(true);
  const [allNodes, setAllNodes] = useState<any[]>([]);
  const [allEdges, setAllEdges] = useState<any[]>([]);
  const [maxArc, setMaxArc] = useState(10);
  const [totalArcs, setTotalArcs] = useState(10);
  const [search, setSearch] = useState('');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'hero': return '#69DB7C';
      case 'villain': return '#FF6B6B';
      case 'antihero': return '#FFD43B';
      default: return '#AAAACC';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/characters/graph?universe=${universe}`);
        const data = res.data;
        
        if (!data || !data.nodes || !data.edges) {
          throw new Error("Invalid graph data received from server");
        }

        const arcs = data.nodes.map((n: any) => n.arcNumber || 1);
        const maxArcValue = Math.max(...arcs, 1);
        setTotalArcs(maxArcValue);
        setMaxArc(maxArcValue); // start with all arcs visible
        setAllNodes(data.nodes);
        setAllEdges(data.edges);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching graph data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [universe]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Network once
    networkRef.current = new Network(containerRef.current, { 
      nodes: nodesDataSetRef.current, 
      edges: edgesDataSetRef.current 
    }, {
      physics: {
        stabilization: { iterations: 150, updateInterval: 25 },
        barnesHut: { 
          gravitationalConstant: -8000, 
          springLength: 200,
          avoidOverlap: 0.5
        },
        adaptiveTimestep: true
      },
      interaction: { 
        hover: true, 
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true
      },
      edges: { 
        smooth: { enabled: true, type: "continuous", roundness: 0.15 },
        color: { inherit: "from" }
      }
    });

    networkRef.current.on("click", params => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const clickedNode: any = nodesDataSetRef.current.get(nodeId);
        if (clickedNode && clickedNode.label) {
          navigate("/character/" + encodeURIComponent(clickedNode.label));
        }
      }
    });

    // Stop physics after stabilization to save CPU
    networkRef.current.on("stabilizationIterationsDone", () => {
      networkRef.current?.setOptions({ physics: false });
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [navigate, loading]);

  useEffect(() => {
    if (!allNodes.length) return;

    // Filter nodes by arc and search
    const filteredNodes = allNodes.filter(n => {
      const arcOk = (n.arcNumber || 1) <= maxArc;
      const searchOk = !search || n.name.toLowerCase().includes(search.toLowerCase());
      return arcOk && searchOk;
    }).map(n => ({
        id: n.id,
        label: n.name,
        title: `<div class="glass-card p-4 flex gap-4 items-center">
                  <img src="${n.imageUrl || `https://ui-avatars.com/api/?name=${n.name}&size=64&background=random`}" class="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p class="font-black text-white">${n.name}</p>
                    <p class="text-xs text-muted-text">${n.universe}</p>
                  </div>
                </div>`,
        color: {
          background: n.role === "hero" ? "#1A472A" : n.role === "villain" ? "#4A1A1A" : "#3A2A0A",
          border: n.role === "hero" ? "#69DB7C" : n.role === "villain" ? "#FF6B6B" : "#FFD43B",
          highlight: {
            background: n.role === "hero" ? "#2A6A3A" : n.role === "villain" ? "#6A2A2A" : "#5A4A1A",
            border: "#FFFFFF"
          }
        },
        shape: "dot",
        size: 30,
        shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 10, x: 0, y: 0 },
        font: { color: "#ffffff", size: 14, face: 'Inter', strokeWidth: 2, strokeColor: '#000000' }
      }));

    const filteredIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = allEdges.filter(e =>
      filteredIds.has(e.from) && filteredIds.has(e.to)
    ).map((e, i) => ({
      id: `${e.from}-${e.to}-${i}`,
      from: e.from,
      to: e.to,
      color: { color: e.type === "ALLIED" ? "#69DB7C" : "#FF6B6B", opacity: 0.6 },
      arrows: "to",
      width: 1.5
    }));

    // Update DataSets (more efficient than re-creating Network)
    nodesDataSetRef.current.clear();
    edgesDataSetRef.current.clear();
    nodesDataSetRef.current.add(filteredNodes);
    edgesDataSetRef.current.add(filteredEdges);

    // Re-enable physics for a moment to let new nodes find their place
    if (networkRef.current) {
      networkRef.current.setOptions({ physics: true });
      networkRef.current.stabilize(100);
    }
  }, [allNodes, allEdges, maxArc, search]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-red mb-4" />
        <p className="text-xl font-bold">Fetching Cineverse Data...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black">{universe?.toUpperCase()} UNIVERSE</h1>
          <p className="text-muted-text">Explore connections and relationships</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search character..."
              className="bg-bg-mid border border-white/10 rounded-lg pl-10 pr-4 py-2 w-full focus:border-accent-red outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="spoiler-control flex items-center gap-4 bg-bg-card p-4 rounded-xl border border-white/10 shadow-inner">
            <label className="text-xs font-black text-muted-text uppercase tracking-widest">🛡️ Spoiler Control</label>
            <input
                type="range"
                min={1}
                max={totalArcs}
                value={maxArc}
                onChange={e => setMaxArc(Number(e.target.value))}
                className="accent-accent-red cursor-pointer w-32 h-1.5 bg-white/10 rounded-full appearance-none"
            />
            <span className="text-xs font-black text-white">Arc {maxArc} / {totalArcs}</span>
          </div>
        </div>
      </div>

      {maxArc < totalArcs && (
        <div style={{
            background: "#2a1a0a",
            border: "1px solid #ff9900",
            borderRadius: "8px",
            padding: "8px 15px",
            color: "#ff9900",
            marginBottom: "12px"
        }}>
            Spoiler mode ON — showing characters up to Arc {maxArc} only
        </div>
      )}

      <div className="flex gap-6 mb-4 text-sm font-bold">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-hero-green"></div> HERO</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-villain-red"></div> VILLAIN</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-antihero-gold"></div> ANTIHERO</div>
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-hero-green"></div> ALLY</div>
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-villain-red"></div> ENEMY</div>
      </div>

      <div 
        ref={containerRef} 
        className="w-full h-[70vh] bg-[#050508] rounded-2xl border border-white/10 overflow-hidden relative"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/20 via-purple-500/20 to-accent-red/20 animate-pulse opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
