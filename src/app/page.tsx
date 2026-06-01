import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import {
  ArrowRight,
  BookOpen,
  Timer,
  BarChart3,
  FileText,
  CheckCircle2,
  Zap,
} from "lucide-react";

const examCards = [
  {
    exam: "JEE",
    fullName: "Joint Entrance Examination",
    description: "Physics, Chemistry & Mathematics questions from JEE Main and Advanced.",
    subjects: ["Physics", "Chemistry", "Maths"],
    color: "from-indigo-500 to-blue-600",
    lightColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    href: "/questions?exam=JEE",
    years: "2010–2024",
  },
  {
    exam: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    description: "Physics, Chemistry & Biology questions from NEET UG papers.",
    subjects: ["Physics", "Chemistry", "Biology"],
    color: "from-emerald-500 to-teal-600",
    lightColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    href: "/questions?exam=NEET",
    years: "2013–2024",
  },
];

const features = [
  {
    icon: Timer,
    title: "Timed Practice",
    description: "Auto-timer on every question to simulate real exam conditions.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: CheckCircle2,
    title: "Instant Feedback",
    description: "See correct answers immediately after selecting your option.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Filter by Year & Chapter",
    description: "Drill down by subject, chapter, and year to target weak areas.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: FileText,
    title: "Download PYQ PDFs",
    description: "Download original previous year papers as PDFs for offline study.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: BookOpen,
    title: "10,000+ Questions",
    description: "Comprehensive question bank covering all chapters and years.",
    color: "text-rose-600 bg-rose-50",
  },
  {
    icon: Zap,
    title: "LeetCode-style UI",
    description: "Clean problem-solving interface designed for focused practice.",
    color: "text-yellow-600 bg-yellow-50",
  },
];

const stats = [
  { value: "10,000+", label: "Questions" },
  { value: "15+", label: "Years Covered" },
  { value: "50+", label: "Chapters" },
  { value: "Free", label: "Forever" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30 -translate-x-1/2" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 text-sm font-medium border-indigo-200 text-indigo-700 bg-indigo-50"
          >
            🎯 India&apos;s #1 PYQ Practice Platform
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            Crack JEE & NEET
            <br />
            <span className="text-indigo-600">with Past Papers</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Practice 10,000+ previous year questions like LeetCode. Filter by subject,
            chapter, and year. Get instant answers with explanations.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/questions">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base gap-2"
              >
                Start Practicing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/papers">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base gap-2">
                <FileText className="w-4 h-4" /> Download Papers
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-foreground font-[family-name:var(--font-sora)]">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Category Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Exam</h2>
          <p className="text-muted-foreground text-lg">
            Targeted question banks for each entrance exam
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {examCards.map((card) => (
            <Link key={card.exam} href={card.href}>
              <div className="group relative rounded-2xl border border-border hover:border-transparent hover:shadow-xl transition-all duration-300 p-8 overflow-hidden cursor-pointer bg-card">
                {/* Gradient top bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${card.lightColor} mb-3`}
                    >
                      {card.years}
                    </div>
                    <h3 className="text-2xl font-bold">{card.exam}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{card.fullName}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </div>

                <p className="text-muted-foreground text-sm mb-5">{card.description}</p>

                <div className="flex gap-2 flex-wrap">
                  {card.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to prepare
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Built specifically for JEE and NEET aspirants who want structured,
              exam-focused practice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-background rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to start practicing?
            </h2>
            <p className="text-indigo-100 text-lg mb-8 max-w-lg mx-auto">
              Join thousands of students already using PYQLab to ace their entrance exams.
            </p>
            <Link href="/questions">
              <Button
                size="lg"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 h-12 text-base font-semibold gap-2"
              >
                Browse Questions <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">Ryqon</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Ryqon. Built for JEE & NEET aspirants.
          </p>
        </div>
      </footer>
    </div>
  );
}