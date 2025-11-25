import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started">
            Get Started →
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Easy Scanning',
      description: 'Automatic edge detection and perspective correction make scanning documents quick and effortless.',
    },
    {
      title: 'Powerful Editing',
      description: 'Crop, rotate, apply filters, and enhance your scans with intuitive editing tools.',
    },
    {
      title: 'Flexible Export',
      description: 'Export to PDF, images, or share directly with other apps. OCR support for searchable documents.',
    },
    {
      title: 'Privacy First',
      description: 'All processing happens on your device. Your documents never leave your control.',
    },
    {
      title: 'Open Source',
      description: 'Free and open source. No ads, no tracking, no premium features. Community driven development.',
    },
    {
      title: 'Cross Platform',
      description: 'Available on Android and iOS with consistent features across both platforms.',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
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

function HomepageScreenshot() {
  return (
    <section className={styles.screenshot}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2">See It In Action</Heading>
          <img 
            src="/OSS-DocumentScanner/img/capture-1.png" 
            alt="OSS Document Scanner capture screen" 
            className={styles.screenshotImage}
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="Documentation for OSS Document Scanner - Open Source Document Scanning App">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageScreenshot />
      </main>
    </Layout>
  );
}
