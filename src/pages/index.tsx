import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";

import styles from "./index.module.css";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ShikiCodeBlock from '../components/ShikiCodeBlock';

function HeroSection() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        {/* Hero Headline */}
        <div className={styles.heroText}>
          <h1 className={`${styles.heroHeadline} ${styles.customHeadline}`}>
            Bangun aplikasi single-page,{" "}
            <strong>tanpa membangun API.</strong>
          </h1>
          <p className={styles.heroSubheadline}>
            Buat <strong>aplikasi single-page modern React, Vue, dan Svelte</strong> menggunakan routing server-side klasik. Berfungsi dengan backend apa pun — dioptimalkan untuk Laravel.
          </p>
        </div>

        {/* Code Example */}
        <div className={styles.codeExample}>
          <Tabs groupId="code-example" defaultValue="controller" values={[
            { label: 'UserController.php', value: 'controller' },
            { label: 'Users.vue', value: 'vue' },
          ]}>
            <TabItem value="controller">
              <ShikiCodeBlock
                code={`class UsersController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::all(),
        ]);
    }
}`}
                language="php"
              />
            </TabItem>
            <TabItem value="vue">
              <ShikiCodeBlock
                code={`<script setup>
import Layout from './Layout'
import { Link, Head } from '@inertiajs/vue3'

defineProps({ users: Array })
</script>

<template>
  <Layout>
    <Head title="Users" />
    <div v-for="user in users" :key="user.id">
      <Link :href="/users/\${user.id}">
        {{ user.name }}
      </Link>
      <div>{{ user.email }}</div>
    </div>
  </Layout>
</template>`}
                language="vue"
              />
            </TabItem>
          </Tabs>
        </div>

        {/* CTA Buttons */}
        <div className={styles.heroActions}>
          <Link to="/docs/intro" className={styles.primaryButton}>
            Mulai Sekarang
          </Link>
        </div>

        {/* Translation Info Card */}
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon}>
            📚
          </div>
          <div className={styles.infoCardContent}>
            <h3 className={styles.infoCardTitle}>Dokumentasi Bahasa Indonesia</h3>
            <p className={styles.infoCardDescription}>
              Website ini merupakan dokumentasi terjemahan dari <a href="https://inertiajs.com" target="_blank" rel="noopener noreferrer" className={styles.infoCardLink}>inertiajs.com</a> yang disertai dengan penambahan penjelasan dan recipes praktis yang sering digunakan dalam proyek Inertia.
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
      description="Dokumentasi Inertia.js bahasa Indonesia - Bangun aplikasi single-page, tanpa membangun API"
    >
      <HeroSection />
    </Layout>
  );
}
