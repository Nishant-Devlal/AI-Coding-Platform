"use client";

import { useState, useRef, useEffect } from "react";

interface Activity {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  activity: Activity[];
}

interface TooltipData {
  x: number;
  y: number;
  date: string;
  count: number;
}

export default function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const activityMap = new Map(
    activity.map((item) => [item.date, item.count])
  );

  const today = new Date();
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const rangeStart = new Date(endDate);
  rangeStart.setDate(rangeStart.getDate() - 364);

  const startDate = new Date(rangeStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: ({ date: string; count: number } | null)[][] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const currentWeek: ({ date: string; count: number } | null)[] = [];

    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (currentDate <= endDate) {
        const dateString = [
          currentDate.getFullYear(),
          String(currentDate.getMonth() + 1).padStart(2, "0"),
          String(currentDate.getDate()).padStart(2, "0"),
        ].join("-");

        currentWeek.push({
          date: dateString,
          count: activityMap.get(dateString) || 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      } 
      else {
        currentWeek.push(null);
      }
    }

    weeks.push(currentWeek);
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getColor = (count: number) => {
    if (count === 0) return "bg-slate-800/80";
    if (count <= 2) return "bg-emerald-800";
    if (count <= 4) return "bg-emerald-600";
    if (count <= 6) return "bg-green-500";
    return "bg-green-400";
  };

  const activityInRange = activity.filter(
    (item) =>
      item.date >=
        [
          rangeStart.getFullYear(),
          String(rangeStart.getMonth() + 1).padStart(2, "0"),
          String(rangeStart.getDate()).padStart(2, "0"),
        ].join("-") &&
      item.date <=
        [
          endDate.getFullYear(),
          String(endDate.getMonth() + 1).padStart(2, "0"),
          String(endDate.getDate()).padStart(2, "0"),
        ].join("-")
  );

  const totalSubmissions = activityInRange.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const activeDays = new Set(
    activityInRange
      .filter((item) => item.count > 0)
      .map((item) => item.date)
  );

  const totalActiveDays = activeDays.size;

  let currentStreak = 0;
  let maxStreak = 0;
  let runningStreak = 0;

  const streakDate = new Date(rangeStart);

  while (streakDate <= endDate) {
    const dateString = [
      streakDate.getFullYear(),
      String(streakDate.getMonth() + 1).padStart(2, "0"),
      String(streakDate.getDate()).padStart(2, "0"),
    ].join("-");

    if ((activityMap.get(dateString) || 0) > 0) {
      runningStreak++;
      maxStreak = Math.max(maxStreak, runningStreak);
    } else {
      runningStreak = 0;
    }

    streakDate.setDate(streakDate.getDate() + 1);
  }

  const checkDate = new Date(endDate);
  const todayString = [
    checkDate.getFullYear(),
    String(checkDate.getMonth() + 1).padStart(2, "0"),
    String(checkDate.getDate()).padStart(2, "0"),
  ].join("-");

  if ((activityMap.get(todayString) || 0) === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (checkDate >= rangeStart) {
    const dateString = [
      checkDate.getFullYear(),
      String(checkDate.getMonth() + 1).padStart(2, "0"),
      String(checkDate.getDate()).padStart(2, "0"),
    ].join("-");

    if ((activityMap.get(dateString) || 0) > 0) {
      currentStreak++;
    } else {
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  const monthLabels: { index: number; label: string }[] = [];
  let lastLabelWeek = -10;

  weeks.forEach((week, index) => {
    const firstOfMonth = week.find((day) => day && day.date.endsWith("-01"));

    if (firstOfMonth) {
      const [, month] = firstOfMonth.date.split("-");
      const label = new Date(2000, Number(month) - 1, 1).toLocaleDateString(
        "en-US",
        { month: "short" }
      );

      if (index - lastLabelWeek >= 2) {
        monthLabels.push({ index, label });
        lastLabelWeek = index;
      }
    }
  });

  if (monthLabels.length > 0 && monthLabels[0].index >= 3) {
    const firstDay = weeks[0].find((day) => day !== null);
    if (firstDay) {
      const [, month] = firstDay.date.split("-");
      const label = new Date(2000, Number(month) - 1, 1).toLocaleDateString(
        "en-US",
        { month: "short" }
      );
      monthLabels.unshift({ index: 0, label });
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-xl border border-slate-800 bg-slate-900 p-6"
    >
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full pb-2 transition-all duration-75"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="whitespace-nowrap rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-white shadow-xl">
            <span className="font-semibold text-emerald-400">
              {tooltip.count === 0 ? "No" : tooltip.count}
            </span>{" "}
            submission{tooltip.count === 1 ? "" : "s"} on {formatDate(tooltip.date)}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Coding Activity</h2>
          <p className="mt-1 text-sm text-slate-400">
            <span className="font-semibold text-white">
              {totalSubmissions.toLocaleString()}
            </span>{" "}
            submissions in the past one year
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div>
            <span className="text-slate-400">Total active days: </span>
            <span className="font-semibold text-white">{totalActiveDays}</span>
          </div>

          <div>
            <span className="text-slate-400">Max streak: </span>
            <span className="font-semibold text-white">{maxStreak}</span>
          </div>

          <div>
            <span className="text-slate-400">Current streak: </span>
            <span className="font-semibold text-white">{currentStreak}</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto pb-2">
        <div className="min-w-max">
          <div className="flex items-center">
            <div className="w-8 shrink-0" />

            <div
              className="mb-2 grid"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
                columnGap: "4px",
              }}
            >
              {monthLabels.map((month) => (
                <span
                  key={`${month.index}-${month.label}`}
                  className="text-xs text-slate-400 select-none"
                  style={{
                    gridColumn: month.index + 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {month.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex">
            <div className="grid w-8 shrink-0 grid-rows-7 gap-1 pr-2 text-[10px] text-slate-400 select-none">
              <span className="h-3 flex items-center"></span>
              <span className="h-3 flex items-center">Mon</span>
              <span className="h-3 flex items-center"></span>
              <span className="h-3 flex items-center">Wed</span>
              <span className="h-3 flex items-center"></span>
              <span className="h-3 flex items-center">Fri</span>
              <span className="h-3 flex items-center"></span>
            </div>

            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, 12px)`,
                columnGap: "4px",
              }}
            >
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-rows-7 gap-1">
                  {week.map((day, dayIndex) =>
                    day ? (
                      <div
                        key={day.date}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect =
                            containerRef.current?.getBoundingClientRect() || {
                              left: 0,
                              top: 0,
                            };
                          setTooltip({
                            x: rect.left - containerRect.left + rect.width / 2,
                            y: rect.top - containerRect.top,
                            date: day.date,
                            count: day.count,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className={`h-3 w-3 rounded-[2px] transition-all duration-150 cursor-pointer hover:ring-1 hover:ring-white/80 ${getColor(
                          day.count
                        )}`}
                      />
                    ) : (
                      <div
                        key={`empty-${dayIndex}`}
                        className="h-3 w-3 opacity-0 pointer-events-none"
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-400 select-none">
        <span>Less</span>
        <div className="h-3 w-3 rounded-[2px] bg-slate-800/80" />
        <div className="h-3 w-3 rounded-[2px] bg-emerald-800" />
        <div className="h-3 w-3 rounded-[2px] bg-emerald-600" />
        <div className="h-3 w-3 rounded-[2px] bg-green-500" />
        <div className="h-3 w-3 rounded-[2px] bg-green-400" />
        <span>More</span>
      </div>
    </div>
  );
}
