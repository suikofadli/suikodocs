import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  inertiaSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "📖 Introduction",
    },
    {
      type: "doc",
      id: "demo-application",
      label: "🚀 Demo Application",
    },
    {
      type: "doc",
      id: "upgrade-guide",
      label: "⬆️ Upgrade Guide",
    },
    {
      type: "category",
      label: "🛠️ Installation",
      items: [
        {
          type: "doc",
          id: "installation/server-side-setup",
          label: "Server-side",
        },
        {
          type: "doc",
          id: "installation/client-side-setup",
          label: "Client-side",
        },
      ],
    },
    {
      type: "category",
      label: "💡 Core Concepts",
      items: [
        {
          type: "doc",
          id: "core-concepts/who-is-it-for",
          label: "Who is it for",
        },
        {
          type: "doc",
          id: "core-concepts/how-it-works",
          label: "How it works",
        },
        {
          type: "doc",
          id: "core-concepts/the-protocol",
          label: "The protocol",
        },
      ],
    },
    {
      type: "category",
      label: "🎯 The Basics",
      items: [
        {
          type: "doc",
          id: "the-basics/pages",
          label: "Pages",
        },
        {
          type: "doc",
          id: "the-basics/responses",
          label: "Responses",
        },
        {
          type: "doc",
          id: "the-basics/redirects",
          label: "Redirects",
        },
        {
          type: "doc",
          id: "the-basics/routing",
          label: "Routing",
        },
        {
          type: "doc",
          id: "the-basics/title-and-meta",
          label: "Title & Meta",
        },
        {
          type: "doc",
          id: "the-basics/links",
          label: "Links",
        },
        {
          type: "doc",
          id: "the-basics/manual-visits",
          label: "Manual Visits",
        },
        {
          type: "doc",
          id: "the-basics/forms",
          label: "Forms",
        },
        {
          type: "doc",
          id: "the-basics/file-uploads",
          label: "File Uploads",
        },
        {
          type: "doc",
          id: "the-basics/validation",
          label: "Validation",
        },
        {
          type: "doc",
          id: "the-basics/view-transitions",
          label: "View Transitions",
        },
      ],
    },
    {
      type: "category",
      label: "📊 Data & Props",
      items: [
        {
          type: "doc",
          id: "data-and-props/shared-data",
          label: "Shared Data",
        },
        {
          type: "doc",
          id: "data-and-props/partial-reloads",
          label: "Partial Reloads",
        },
        {
          type: "doc",
          id: "data-and-props/deferred-props",
          label: "Deferred Props",
        },
        {
          type: "doc",
          id: "data-and-props/merging-props",
          label: "Merging Props",
        },
        {
          type: "doc",
          id: "data-and-props/polling",
          label: "Polling",
        },
        {
          type: "doc",
          id: "data-and-props/prefetching",
          label: "Prefetching",
        },
        {
          type: "doc",
          id: "data-and-props/load-when-visible",
          label: "Load When Visible",
        },
        {
          type: "doc",
          id: "data-and-props/infinite-scroll",
          label: "Infinite Scroll",
        },
        {
          type: "doc",
          id: "data-and-props/remembering-state",
          label: "Remembering State",
        },
      ],
    },
    {
      type: "category",
      label: "🔒 Security",
      items: [
        {
          type: "doc",
          id: "security/authentication",
          label: "Authentication",
        },
        {
          type: "doc",
          id: "security/authorization",
          label: "Authorization",
        },
        {
          type: "doc",
          id: "security/csrf-protection",
          label: "CSRF Protection",
        },
        {
          type: "doc",
          id: "security/history-encryption",
          label: "History Encryption",
        },
      ],
    },
    {
      type: "category",
      label: "⚡ Advanced",
      items: [
        {
          type: "doc",
          id: "advanced/asset-versioning",
          label: "Asset Versioning",
        },
        {
          type: "doc",
          id: "advanced/code-splitting",
          label: "Code Splitting",
        },
        {
          type: "doc",
          id: "advanced/error-handling",
          label: "Error Handling",
        },
        {
          type: "doc",
          id: "advanced/events",
          label: "Events",
        },
        {
          type: "doc",
          id: "advanced/progress-indicators",
          label: "Progress Indicators",
        },
        {
          type: "doc",
          id: "advanced/scroll-management",
          label: "Scroll Management",
        },
        {
          type: "doc",
          id: "advanced/server-side-rendering",
          label: "Server-side Rendering",
        },
        {
          type: "doc",
          id: "advanced/testing",
          label: "Testing",
        },
      ],
    },
    {
      type: "category",
      label: "📚 Recipes",
      items: [
        {
          type: "doc",
          id: "recipes/fetching-dynamic-data",
          label: "Fetching Dynamic Data",
        },
      ],
    },
  ],
};

export default sidebars;
