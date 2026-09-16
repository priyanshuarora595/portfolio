export type ProjectLink = { label: string; href: string };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  featured: boolean;
  internal: boolean;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "phi-tokenization-pipeline",
    title: "PHI Tokenization Pipeline for US Healthcare Data",
    tagline:
      "Event-driven AWS pipeline (S3 → Glue → SQS → Lambda → EC2) orchestrating third-party PHI tokenization for HIPAA-compliant data exchange.",
    tags: ["AWS Lambda", "SQS", "Glue", "S3", "EC2", "Python", "HIPAA"],
    featured: true,
    internal: true,
    links: [],
  },
  {
    slug: "s3-cross-account-migration",
    title: "Cross-Account S3 Migration & Consolidation",
    tagline:
      "Zero-downtime, event-driven migration of 35 customers from per-customer S3 buckets across AWS accounts into one consolidated bucket.",
    tags: ["AWS S3", "SQS", "Lambda", "IAM", "Python"],
    featured: true,
    internal: true,
    links: [],
  },
  {
    slug: "self-service-portal",
    title: "Self-Service File Processing Configuration Service",
    tagline:
      "Serverless FastAPI CRUD service replacing manual S3-file-drop configuration with instant self-service — cut onboarding time ~10x.",
    tags: ["FastAPI", "AWS Lambda", "API Gateway", "DynamoDB"],
    featured: true,
    internal: true,
    links: [],
  },
  {
    slug: "ar-shoes",
    title: "AR Shoe Try-On",
    tagline:
      "Full-stack AR storefront with real-time camera-based foot tracking and shoe overlay, plus a role-based manager portal — live and deployed.",
    tags: ["Next.js", "Django REST Framework", "DeepAR SDK", "Cloudflare R2"],
    featured: true,
    internal: false,
    links: [
      { label: "Live demo", href: "https://ar-shoes-try-on-mayavarta.vercel.app/" },
      { label: "Frontend repo", href: "https://github.com/priyanshuarora595/ar-shoes" },
      { label: "Backend repo", href: "https://github.com/priyanshuarora595/ar-shoes-backend" },
    ],
  },
  {
    slug: "mentor-ai",
    title: "Mentor AI — Multi-Agent Learning Roadmap Generator",
    tagline:
      "CrewAI multi-agent pipeline that turns any topic into a tiered learning roadmap, running against a fully local model or any of three cloud providers.",
    tags: ["CrewAI", "LiteLLM", "Streamlit", "SQLAlchemy"],
    featured: false,
    internal: false,
    links: [{ label: "GitHub repo", href: "https://github.com/priyanshuarora595/mentor-ai" }],
  },
  {
    slug: "expense-monitor",
    title: "Expense Monitor — Offline-First Finance PWA",
    tagline:
      "Installable PWA with offline write-queueing (IndexedDB + Background Sync) and WebAuthn biometric unlock layered onto a DRF token backend.",
    tags: ["Django REST Framework", "PWA", "WebAuthn", "IndexedDB"],
    featured: false,
    internal: false,
    links: [
      { label: "Frontend repo", href: "https://github.com/priyanshuarora595/expense-monitor" },
      {
        label: "Backend repo",
        href: "https://github.com/priyanshuarora595/expense-monitor-backend",
      },
      {
        label: "Live app",
        href: "https://priyanshuarora595.github.io/expense-monitor/index.html",
      },
    ],
  },
  {
    slug: "jira-sla-monitor",
    title: "Jira SLA Monitoring Tool",
    tagline:
      "Restored a support team's SLA dashboard after an upstream Jira API schema change broke ticket parsing.",
    tags: ["Flask", "Jira REST API", "Python"],
    featured: false,
    internal: true,
    links: [],
  },
  {
    slug: "market-trend-analysis",
    title: "Nifty 100 Stock Price Prediction",
    tagline:
      "Hybrid LSTM + Dense network predicting next-day close prices across 43 Nifty 100 stocks (R² 0.976 on held-out test data) — IIT Ropar coursework.",
    tags: ["TensorFlow", "Keras", "LSTM", "Streamlit"],
    featured: false,
    internal: false,
    links: [
      {
        label: "GitHub repo",
        href: "https://github.com/priyanshuarora595/Market-Trend-Analysis",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const moreProjects = projects.filter((p) => !p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
