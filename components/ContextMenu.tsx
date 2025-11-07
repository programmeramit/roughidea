"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import gsap from "gsap";
import { Edit3, Copy, Share2, Trash2, SmilePlus, X, Wand2, Type } from "lucide-react";
import { pipeline } from "@huggingface/transformers";

interface ContextMenuProps {
  x: number;
  y: number;
  trigger: (prop: any) => void;
}

const EMOTIONS = [
  { name: "joy", emoji: "😁", color: "#facc15" },
  { name: "sadness", emoji: "😢", color: "#60a5fa" },
  { name: "anger", emoji: "😡", color: "#ef4444" },
  { name: "surprise", emoji: "🤩", color: "#a855f7" },
  { name: "calm", emoji: "😌", color: "#34d399" },
  { name: "fear", emoji: "😨", color: "#9ca3af" },
];

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, trigger }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<SVGSVGElement>(null);

  const [visible, setVisible] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [output, setOutput] = useState("");
  const [toneOutput, setToneOutput] = useState("");
  const [rewriteOutput, setRewriteOutput] = useState("");

  // 🧠 Load emotion model safely
  useEffect(() => {
    let isMounted = true;
    async function loadModel() {
      if (typeof window === "undefined") return;
      setLoadingModel(true);

      const pipe = await pipeline(
        "text-classification",
        "nicky48/emotion-english-distilroberta-base-ONNX",
        { dtype: "q4" }
      );

      if (isMounted) {
        setModel(() => pipe);
        setLoadingModel(false);
      }
    }
    loadModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // 🧊 Appear animation
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    gsap.set(menu, { opacity: 0, y: 10, scale: 0.95 });
    gsap.to(menu, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: "back.out(1.7)",
      onStart: () => setVisible(true),
    });
  }, []);

  const closeMenu = () => {
    const menu = menuRef.current;
    if (!menu) return;
    gsap.to(menu, {
      opacity: 0,
      y: 10,
      scale: 0.95,
      duration: 0.25,
      ease: "power2.inOut",
      onComplete: () => trigger(null),
    });
  };

  // 🧠 Analyze emotions
  const analyzeEmotions = async () => {
    if (!model) {
      alert("Model is still loading...");
      return;
    }
    const text = window.getSelection()?.toString() || "I am feeling great!";
    const results = await model(text);

    const scores = EMOTIONS.map((emotion) => {
      const match = results.find(
        (r: any) => r.label.toLowerCase() === emotion.name.toLowerCase()
      );
      return (match?.score || 0) * 100;
    });

    generateEmotionChart(scores);
  };

  // ✨ Generate Emotion Chart (D3)
  const generateEmotionChart = (data: number[]) => {
    setShowChart(true);
    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 320;
    const height = 200;
    const padding = 40;

    const x = d3
      .scaleBand()
      .domain(EMOTIONS.map((_, i) => i.toString()))
      .range([0, width])
      .padding(0.25);

    const y = d3.scaleLinear().domain([0, 100]).range([height - padding, 0]);

    const g = svg.append("g").attr("transform", `translate(30,10)`);

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(i.toString())!)
      .attr("width", x.bandwidth())
      .attr("y", height - padding)
      .attr("height", 0)
      .attr("rx", 5)
      .attr("fill", (_, i) => EMOTIONS[i].color)
      .transition()
      .delay((_, i) => i * 100)
      .duration(800)
      .attr("y", (d) => y(d))
      .attr("height", (d) => height - padding - y(d))
      .ease(d3.easeElasticOut.amplitude(1).period(0.3));
  };

  // ✨ Tone Changer
  const changeTone = async (tone: "formal" | "casual" | "persuasive") => {
    setToneOutput("Processing...");
    const text = window.getSelection()?.toString();
    if (!text) return;

    try {
      const res = await fetch("/api/tone", {
        method: "POST",
        body: JSON.stringify({ text, tone }),
      });
      const data = await res.json();
      setToneOutput(data.output);
    } catch (err) {
      setToneOutput("⚠️ Failed to change tone.");
    }
  };

  // ✍️ Text Rewriter
  const rewriteText = async () => {
    setRewriteOutput("Processing...");
    const text = window.getSelection()?.toString();
    if (!text) return;

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setRewriteOutput(data.output);
    } catch (err) {
      setRewriteOutput("⚠️ Failed to rewrite text.");
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl px-3 py-2 min-w-[300px]"
      style={{ top: y, left: x, transform: "translate(-50%, 0)", zIndex: 50 }}
    >
      <p className="text-gray-400 text-xs mb-1 px-2">Quick Actions</p>

      {/* 🧠 Analyze Emotion */}
      <button
        onClick={analyzeEmotions}
        disabled={loadingModel}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium ${
          loadingModel
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100/70 active:bg-gray-200/70"
        }`}
      >
        <SmilePlus size={16} className="text-gray-500" />
        {loadingModel ? "Loading Model..." : "Analyze Emotions"}
      </button>

      {/* ✨ Tone Change */}
      <button
        onClick={() => changeTone("formal")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-gray-100/70 active:bg-gray-200/70"
      >
        <Wand2 size={16} className="text-gray-500" />
        Make Text Formal
      </button>

      <button
        onClick={() => changeTone("casual")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-gray-100/70 active:bg-gray-200/70"
      >
        <Wand2 size={16} className="text-gray-500" />
        Make Text Casual
      </button>

      <button
        onClick={() => changeTone("persuasive")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-gray-100/70 active:bg-gray-200/70"
      >
        <Wand2 size={16} className="text-gray-500" />
        Make Text Persuasive
      </button>

      {/* ✍️ Rewrite Text */}
      <button
        onClick={rewriteText}
        className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium hover:bg-gray-100/70 active:bg-gray-200/70"
      >
        <Type size={16} className="text-gray-500" />
        Rewrite Text
      </button>

      {/* 🧭 Chart */}
      {showChart && (
        <>
          <div className="border-t border-gray-200/60 my-1" />
          <div className="p-2">
            <svg ref={chartRef} width="380" height="220"></svg>
          </div>
        </>
      )}

      {/* 🧩 Outputs */}
      {toneOutput && (
        <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md p-2 whitespace-pre-wrap">
          <strong>Tone Output:</strong> {toneOutput}
        </div>
      )}
      {rewriteOutput && (
        <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md p-2 whitespace-pre-wrap">
          <strong>Rewrite:</strong> {rewriteOutput}
        </div>
      )}

      <div className="border-t border-gray-200/60 my-1" />
      <button
        onClick={closeMenu}
        className="flex items-center gap-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg px-3 py-2 text-left text-gray-600 transition-colors font-medium"
      >
        <X size={16} className="text-gray-400" />
        Cancel
      </button>
    </div>
  );
};

export default ContextMenu;
