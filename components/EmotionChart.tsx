"use client";

import React, { useEffect, useRef, PropsWithChildren } from "react";
import * as d3 from "d3";
import { gsap } from "gsap";
import { useChatData } from "@/tools/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Smile, Frown, Angry, Heart, Meh } from "lucide-react";

interface EmotionResult {
  sentence: string;
  label: string;
  score: number;
}

interface EmotionChartProps extends PropsWithChildren {
  emotions: Record<string, EmotionResult>;
}

// Icon mapping for legend
const emotionIcons: Record<string, JSX.Element> = {
  joy: <Smile className="w-4 h-4 text-yellow-500" />,
  happiness: <Smile className="w-4 h-4 text-yellow-500" />,
  love: <Heart className="w-4 h-4 text-pink-500" />,
  anger: <Angry className="w-4 h-4 text-red-500" />,
  sadness: <Frown className="w-4 h-4 text-blue-500" />,
  fear: <Meh className="w-4 h-4 text-purple-500" />,
  neutral: <Meh className="w-4 h-4 text-gray-500" />,
};

const EmotionChart: React.FC<EmotionChartProps> = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const emotions = useChatData((state) => state.emotions);

  useEffect(() => {
    if (!chartRef.current) return;

    const data = Object.entries(emotions).map(([sentence, res], i) => ({
      id: `s${i + 1}`,
      label: res.label,
      score: res.score,
      sentence: res.sentence,
    }));

    d3.select(chartRef.current).selectAll("*").remove();
    if (data.length === 0) return;

    const width = chartRef.current.clientWidth || 600;
    const height = 300;
    const margin = { top: 40, right: 120, bottom: 40, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const grouped = d3.group(data, (d) => d.label);
    const emotionKeys = Array.from(grouped.keys());

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.id))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(emotionKeys)
      .range(d3.schemeSet2);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y).ticks(5).tickFormat((d) => `${Math.round(+d * 100)}%`)
      )
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#666");

    // Lines and dots
    const line = d3
      .line<{ id: string; label: string; score: number }>()
      .x((d: any) => x(d.id)! + x.bandwidth() / 2)
      .y((d: any) => y(d.score))
      .curve(d3.curveMonotoneX);

    grouped.forEach((values: any, emotion: any) => {
      const path = svg
        .append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", color(emotion)!)
        .attr("stroke-width", 2)
        .attr("d", line)
        .attr("opacity", 0);

      const totalLength = path.node()?.getTotalLength() ?? 0;
      path
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength);

      gsap.to(path.node(), {
        duration: 1.2,
        strokeDashoffset: 0,
        opacity: 1,
        ease: "power2.out",
      });

      const dots = svg
        .selectAll(`.dot-${emotion}`)
        .data(values)
        .join("circle")
        .attr("class", `dot-${emotion}`)
        .attr("cx", (d) => x(d.id)! + x.bandwidth() / 2)
        .attr("cy", (d) => y(d.score))
        .attr("r", 0)
        .attr("fill", color(emotion)!);

      gsap.to(dots.nodes(), {
        duration: 0.6,
        attr: { r: 4 },
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.4,
      });
    });

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    emotionKeys.forEach((key, i) => {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25)
        .attr("r", 6)
        .attr("fill", color(key)!);

      legend
        .append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 5)
        .text(key)
        .style("font-size", "13px")
        .style("fill", "#444");
    });
  }, [emotions]);

  return (
    <Card className="flex-1 bg-white/70 backdrop-blur-sm border border-gray-100 shadow-md rounded-2xl p-4 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Smile className="w-5 h-5 text-yellow-500" />
          Emotion Chart
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div ref={chartRef} className="w-full h-[300px]" />
        
      </CardContent>
    </Card>
  );
};

export default EmotionChart;
