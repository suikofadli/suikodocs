import React, { useEffect, useState } from 'react';
import styles from './ShikiCodeBlock.module.css';

interface ShikiCodeBlockProps {
  code: string;
  language: string;
  theme?: string;
}

export default function ShikiCodeBlock({ code, language }: ShikiCodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const highlightCode = async () => {
      setIsLoading(true);
      try {
        // Dynamic import shiki
        const { createHighlighter } = await import('shiki');

        // Detect current theme
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const selectedTheme = isDarkMode ? 'dracula' : 'github-light';

        const highlighter = await createHighlighter({
          themes: ['dracula', 'github-light', 'material-theme-darker'],
          langs: [language, 'javascript', 'php', 'vue', 'typescript', 'jsx', 'tsx'],
        });

        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: selectedTheme,
        });

        setHighlightedCode(html);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback to simple pre/code if shiki fails
        setHighlightedCode(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    };

    highlightCode();

    // Listen for theme changes
    const handleThemeChange = () => {
      highlightCode();
    };

    // Observer for theme attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          highlightCode();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      observer.disconnect();
    };
  }, [code, language]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <pre className={styles.fallbackCode}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div
      className={styles.shikiContainer}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}