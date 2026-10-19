interface ProfileHeatmapProps {
  activityCounts: { date: string; count: number }[];
}

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const WEEK_COUNT = 53;

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getIntensity(count: number) {
  if (count === 0) return "bg-secondary";
  if (count === 1) return "bg-emerald-200";
  if (count <= 3) return "bg-emerald-400";
  if (count <= 6) return "bg-emerald-600";
  return "bg-emerald-800";
}

export default function ProfileHeatmap({
  activityCounts,
}: ProfileHeatmapProps) {
  const counts = new Map(
    activityCounts.map(({ date, count }) => [date, count])
  );
  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );
  const startUtc = todayUtc - 364 * DAY_IN_MILLISECONDS;
  const firstVisibleUtc =
    startUtc -
    new Date(startUtc).getUTCDay() * DAY_IN_MILLISECONDS;

  const weeks = Array.from({ length: WEEK_COUNT }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const date = new Date(
        firstVisibleUtc +
          (weekIndex * 7 + dayIndex) * DAY_IN_MILLISECONDS
      );
      const key = dateKey(date);
      const isVisible = date.getTime() >= startUtc && date.getTime() <= todayUtc;
      const count = isVisible ? (counts.get(key) ?? 0) : 0;

      return { date, key, count, isVisible };
    })
  );

  const monthLabels = weeks.flatMap((week, weekIndex) => {
    const date = week[0].date;
    if (date.getUTCDate() > 7) return [];

    return [
      {
        label: new Intl.DateTimeFormat("en", {
          month: "short",
          timeZone: "UTC",
        }).format(date),
        weekIndex,
      },
    ];
  });
  const activeDays = activityCounts.length;
  const totalSolved = activityCounts.reduce(
    (total, { count }) => total + count,
    0
  );

  return (
    <section className="mb-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Your activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalSolved} {totalSolved === 1 ? "question" : "questions"} solved
            in the last year
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {activeDays} {activeDays === 1 ? "active day" : "active days"}
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <div className="mb-2 grid grid-cols-[24px_1fr] gap-2">
            <span aria-hidden="true" />
            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] text-xs text-muted-foreground">
              {monthLabels.map(({ label, weekIndex }) => (
                <span
                  key={`${label}-${weekIndex}`}
                  className="whitespace-nowrap"
                  style={{ gridColumnStart: weekIndex + 1 }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[24px_1fr] gap-2">
            <div className="grid grid-rows-7 gap-1 text-[10px] text-muted-foreground">
              {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => (
                <span key={index} className="flex h-3 items-center">
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {weeks.flat().map(({ date, key, count, isVisible }) => {
                const label = new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(date);
                const description = isVisible
                  ? `${count} ${count === 1 ? "question" : "questions"} solved on ${label}`
                  : "";

                return (
                  <div
                    key={key}
                    title={description}
                    aria-label={description || undefined}
                    className={`h-3 w-3 rounded-[3px] ${
                      isVisible ? getIntensity(count) : "bg-transparent"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 4, 7].map((count) => (
          <span
            key={count}
            aria-hidden="true"
            className={`h-3 w-3 rounded-[3px] ${getIntensity(count)}`}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
