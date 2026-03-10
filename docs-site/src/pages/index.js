import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Two Powerful Open Source Apps
        </Heading>
        <p className="hero__subtitle">
          Scan documents and manage cards - privacy-focused, free, and open source
        </p>
        <div className={styles.badges}>
          <a href="https://github.com/Akylas/OSS-DocumentScanner/stargazers">
            <img src="https://img.shields.io/github/stars/Akylas/OSS-DocumentScanner?style=flat" alt="GitHub stars" />
          </a>
          <a href="https://github.com/Akylas/OSS-DocumentScanner/blob/master/COPYING">
            <img src="https://img.shields.io/github/license/Akylas/OSS-DocumentScanner" alt="License" />
          </a>
          <a href="https://github.com/Akylas/OSS-DocumentScanner/releases/">
            <img src="https://img.shields.io/github/downloads/Akylas/OSS-DocumentScanner/total.svg" alt="Downloads" />
          </a>
          <a href="https://hosted.weblate.org/engage/oss-document-scanner/">
            <img src="https://hosted.weblate.org/widgets/oss-document-scanner/-/svg-badge.svg" alt="Translation status" />
          </a>
        </div>
      </div>
    </header>
  );
}

function AppShowcase() {
  const apps = [
    {
      name: 'OSS Document Scanner',
      description: 'Scan, edit, and export documents with automatic edge detection and perspective correction.',
      featureImage: useBaseUrl('/img/apps/documentscanner-feature.png'),
      playStore: 'https://play.google.com/store/apps/details?id=com.akylas.documentscanner',
      appStore: 'https://apps.apple.com/us/app/oss-document-scanner/id6472918564',
      izzyOnDroid: 'https://apt.izzysoft.de/packages/com.akylas.documentscanner',
      docsLink: '/getting-started',
      features: ['Document scanning', 'Auto edge detection', 'PDF export', 'OCR support', 'Cloud sync'],
    },
    {
      name: 'OSS CardWallet',
      description: 'Store and manage loyalty cards, tickets, and barcodes securely on your device.',
      featureImage: useBaseUrl('/img/apps/cardwallet-feature.png'),
      playStore: 'https://play.google.com/store/apps/details?id=com.akylas.cardwallet',
      appStore: 'https://apps.apple.com/app/oss-cardwallet/id6504414362',
      izzyOnDroid: 'https://apt.izzysoft.de/packages/com.akylas.cardwallet',
      docsLink: '/cardwallet/getting-started',
      features: ['Barcode scanning', 'Card management', 'Multiple formats', 'Backup & sync', 'Privacy focused'],
    },
  ];

  return (
    <section className={styles.appShowcase}>
      <div className="container">
        <div className={styles.appGrid}>
          {apps.map((app, idx) => (
            <div key={idx} className={styles.appCard}>
              <img 
                src={app.featureImage} 
                alt={`${app.name} feature graphic`}
                className={styles.featureGraphic}
              />
              <div className={styles.appContent}>
                <Heading as="h2">{app.name}</Heading>
                <p>{app.description}</p>
                <ul className={styles.featureList}>
                  {app.features.map((feature, fidx) => (
                    <li key={fidx}>✓ {feature}</li>
                  ))}
                </ul>
                <div className={styles.downloadButtons}>
                  <a href={app.playStore} className={styles.storeButton}>
                    <img 
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                      alt="Get it on Google Play" 
                      height="50"
                    />
                  </a>
                  <a href={app.appStore} className={styles.storeButton}>
                    <img 
                      src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83" 
                      alt="Download on the App Store" 
                      height="50"
                    />
                  </a>
                  <a href={app.izzyOnDroid} className={styles.storeButton}>
                    <img 
                      src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png" 
                      alt="Get it on IzzyOnDroid" 
                      height="50"
                    />
                  </a>
                </div>
                <Link
                  className="button button--primary button--md"
                  to={app.docsLink}>
                  View Documentation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommonFeatures() {
  const features = [
    {
      title: '🔒 Privacy First',
      description: 'All processing happens on your device. Your data never leaves your control.',
    },
    {
      title: '📱 Cross Platform',
      description: 'Available on both Android and iOS with consistent features.',
    },
    {
      title: '🌍 Open Source',
      description: 'Free and open source. No ads, no tracking, community driven.',
    },
    {
      title: '☁️ Cloud Sync',
      description: 'Optional sync via WebDAV to your own cloud storage.',
    },
    {
      title: '🌐 Multi-language',
      description: 'Translated into many languages by the community.',
    },
    {
      title: '⚡ Fast & Efficient',
      description: 'Native performance with optimized image processing.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Shared Features
        </Heading>
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className={clsx('col col--4', styles.feature)}>
              <div className="text--center padding-horiz--md">
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DonationBanner() {
  return (
    <section className={styles.donationBanner}>
      <div className="container">
        <div className={styles.donationContent}>
          <div className={styles.donationText}>
            <Heading as="h2">❤️ Love These Apps? Support Development!</Heading>
            <p>
              These apps are 100% free, open source, and ad-free. Your donation directly supports 
              continued development, new features, and bug fixes.
            </p>
          </div>
          <div className={styles.donationButtons}>
            <a 
              href="https://github.com/sponsors/farfromrefug" 
              className="button button--primary button--lg"
            >
              💝 Sponsor on GitHub
            </a>
            <a 
              href="https://www.paypal.com/paypalme/nicoschmidt" 
              className="button button--secondary button--lg"
            >
              💳 Donate via PayPal
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className={styles.supportSection}>
      <div className="container text--center">
        <Heading as="h2">Our Sponsors</Heading>
        <p>
          Thank you to all our generous sponsors who help keep this project alive!
        </p>
        <div className={styles.sponsors}>
          <img 
            src="https://raw.githubusercontent.com/farfromrefug/sponsorkit/main/sponsors.svg" 
            alt="Sponsors"
            className={styles.sponsorsImage}
          />
        </div>
        <a 
          href="https://github.com/sponsors/farfromrefug" 
          className="button button--outline button--primary button--lg margin-top--md"
        >
          Become a Sponsor →
        </a>
      </div>
    </section>
  );
}

function TranslationSection() {
  return (
    <section className={styles.translationSection}>
      <div className="container text--center">
        <Heading as="h2">Help Translate</Heading>
        <p>Translations are hosted on Weblate. Help make these apps available in your language!</p>
        <a href="https://hosted.weblate.org/engage/oss-document-scanner/">
          <img 
            src="https://hosted.weblate.org/widgets/oss-document-scanner/-/multi-auto.svg" 
            alt="Translation status"
            className={styles.translationWidget}
          />
        </a>
      </div>
    </section>
  );
}

function ContributeSection() {
  return (
    <section className={styles.contributeSection}>
      <div className="container text--center">
        <Heading as="h2">📝 Contribute to Documentation</Heading>
        <p>
          Help improve this documentation! Fix typos, add examples, 
          improve explanations, or translate into your language.
        </p>
        <div className={styles.contributeButtons}>
          <Link
            className="button button--primary button--lg"
            to="/contributing">
            📖 Contribution Guide
          </Link>
          <a
            className="button button--outline button--primary button--lg"
            href="https://github.com/Akylas/OSS-DocumentScanner/tree/main/docs-site">
            ✏️ Edit on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title="Best Free Document Scanner App - Open Source PDF Scanner"
      description="OSS Document Scanner - The best free, open source document scanner app for Android and iOS. Scan documents to PDF, auto edge detection, OCR, cloud sync. No ads, 100% privacy.">
      <HomepageHeader />
      <main>
        <DonationBanner />
        <AppShowcase />
        <CommonFeatures />
        <ContributeSection />
        <SupportSection />
        <TranslationSection />
      </main>
    </Layout>
  );
}
