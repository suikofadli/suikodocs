import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.css";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import ShikiCodeBlock from "../components/ShikiCodeBlock";

function HeroSection() {
  return (
    <div className={styles.heroContainer}>
      {/* Decorative animated lines */}
      <div className={styles.decorativeLines}>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
        <div className={styles.line}></div>
      </div>

      <div className={styles.heroContent}>
        {/* Hero Headline */}
        <div className={styles.heroText}>
          <h1 className={styles.heroHeadline}>
            Cara paling produktif untuk membangun aplikasi web Anda
          </h1>
          <p className={styles.heroSubheadline}>
            UI front-end yang dinamis dan powerful tanpa meninggalkan PHP
          </p>
        </div>

        {/* Code Example */}
        <div className={styles.codeExample}>
          <ShikiCodeBlock
            code={`<input type="text" wire:model="search">

// Search will automatically update...
class SearchComponent extends Component
{
    public $search = '';

    public function render()
    {
        return view('livewire.search', [
            'results' => User::where('name', 'like', '%'.$this->search.'%')->get(),
        ]);
    }
}`}
            language="php"
          />
        </div>

        {/* CTA Button */}
        <div className={styles.heroActions}>
          <Link
            to="/docs/getting-started/quickstart"
            className={styles.primaryButton}
          >
            Getting Started
          </Link>
        </div>

        {/* Translation Info Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon}>📚</div>
          <div className={styles.infoCardContent}>
            <h3 className={styles.infoCardTitle}>
              Dokumentasi Bahasa Indonesia
            </h3>
            <p className={styles.infoCardDescription}>
              Website ini merupakan dokumentasi terjemahan dari{" "}
              <a
                href="https://livewire.laravel.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.infoCardLink}
              >
                livewire.laravel.com
              </a>{" "}
              yang disertai dengan penambahan penjelasan dan recipes praktis
              yang sering digunakan dalam proyek Livewire.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Dokumentasi Livewire bahasa Indonesia - Bangun aplikasi dinamis, tanpa API yang rumit"
    >
      <HeroSection />
    </Layout>
  );
}
