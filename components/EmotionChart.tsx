"use client";

import React, { useEffect, useRef, PropsWithChildren } from "react";
import * as d3 from "d3";
import { gsap } from "gsap";
import { useChatData } from "@/tools/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Smile } from "lucide-react";

interface EmotionResult {
  sentence: string;
  label: string;
  score: number;
}

interface EmotionChartProps extends PropsWithChildren {
  emotions: Record<string, EmotionResult>;
}

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

    // Unified color
    const chartColor = "#a48fff";

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6b6b6b");

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y).ticks(5).tickFormat((d) => `${Math.round(+d * 100)}%`)
      )
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6b6b6b");

    // Line function
    const line = d3
      .line<{ id: string; label: string; score: number }>()
      .x((d: any) => x(d.id)! + x.bandwidth() / 2)
      .y((d: any) => y(d.score))
      .curve(d3.curveMonotoneX);

    // Draw paths and dots
    grouped.forEach((values: any, emotion: any) => {
      const path = svg
        .append("path")
        .datum(values)
        .attr("fill", "none")
        .attr("stroke", chartColor)
        .attr("stroke-width", 2.5)
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
        .attr("fill", chartColor);

      gsap.to(dots.nodes(), {
        duration: 0.6,
        attr: { r: 4 },
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.4,
      });
    });

    // Legend (same color)
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right + 20}, ${margin.top})`);

    emotionKeys.forEach((key, i) => {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", i * 25)
        .attr("r", 6)
        .attr("fill", chartColor);

      legend
        .append("text")
        .attr("x", 15)
        .attr("y", i * 25 + 5)
        .text(key)
        .style("font-size", "13px")
        .style("fill", "#4a4a4a");
    });
  }, [emotions]);

  return (
    <Card className="flex-1 bg-white/70 backdrop-blur-sm border border-gray-200 shadow-md rounded-2xl p-4 relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Smile className="w-5 h-5 text-[#a48fff]" />
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
