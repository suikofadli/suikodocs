import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  livewireSidebar: [
    {
      type: "category",
      label: "Getting Started",
      items: [
        "getting-started/quickstart",
        "getting-started/installation",
        "getting-started/upgrading",
      ],
    },
    {
      type: "category",
      label: "Essentials",
      items: [
        "essentials/components",
        "essentials/properties",
        "essentials/actions",
        "essentials/forms",
        "essentials/events",
        "essentials/lifecycle-hooks",
        "essentials/nesting",
        "essentials/testing",
      ],
    },
    {
      type: "category",
      label: "Features",
      items: [
        "features/alpine",
        "features/navigate",
        "features/lazy",
        "features/validation",
        "features/uploads",
        "features/pagination",
        "features/url",
        "features/computed-properties",
        "features/session-properties",
        "features/redirecting",
        "features/downloads",
        "features/locked",
        "features/polling",
        "features/offline",
        "features/teleport",
      ],
    },
    {
      type: "category",
      label: "HTML Directives",
      items: [
        "html-directives/wire-click",
        "html-directives/wire-submit",
        "html-directives/wire-model",
        "html-directives/wire-loading",
        "html-directives/wire-navigate",
        "html-directives/wire-current",
        "html-directives/wire-cloak",
        "html-directives/wire-dirty",
        "html-directives/wire-confirm",
        "html-directives/wire-transition",
        "html-directives/wire-init",
        "html-directives/wire-poll",
        "html-directives/wire-offline",
        "html-directives/wire-ignore",
        "html-directives/wire-replace",
        "html-directives/wire-show",
        "html-directives/wire-stream",
        "html-directives/wire-text",
      ],
    },
    {
      type: "category",
      label: "Concepts",
      items: [
        "concepts/morph",
        "concepts/hydration",
        "concepts/understanding-nesting",
      ],
    },
    {
      type: "category",
      label: "Advanced",
      items: [
        "advanced/troubleshooting",
        "advanced/security",
        "advanced/javascript",
        "advanced/synthesizers",
        "advanced/contribution-guide",
      ],
    },
    {
      type: "category",
      label: "Packages",
      items: [
        "packages/volt",
      ],
    },
    {
      type: "category",
      label: "Additional Resources",
      items: [
        "additional/best-practices",
        "additional/bundling",
        "additional/component-hooks",
        "additional/dirty",
        "additional/how-livewire-works",
        "additional/the-livewire-protocol",
        "additional/blade-components",
      ],
    },
  ],
};

export default sidebars;
