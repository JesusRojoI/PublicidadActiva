'use client';

import { useTranslation } from 'react-i18next';

type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'subheading'; text: string };

interface LegalPageProps {
  namespace: 'legalPrivacy' | 'legalTerms' | 'legalRefund';
}

export default function LegalPage({ namespace }: LegalPageProps) {
  const { t } = useTranslation();

  const title = t(`${namespace}.title`) as string;
  const lastUpdate = t(`${namespace}.lastUpdate`) as string;
  const blocks = (t(`${namespace}.blocks`, { returnObjects: true }) || []) as Block[];

  return (
    <section className="pa-section">
      <div className="pa-container" style={{ maxWidth: 920 }}>
        <div
          style={{
            background: '#fff',
            borderRadius: 22,
            padding: '56px 44px',
            boxShadow: 'var(--pa-shadow)',
          }}
        >
          <h1 className="pa-h2" style={{ marginBottom: 8 }}>
            {title}
          </h1>
          <p
            style={{
              color: 'var(--pa-muted)',
              fontSize: 13,
              marginBottom: 34,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {lastUpdate}
          </p>

          {Array.isArray(blocks) &&
            blocks.map((block, idx) => {
              if (!block || typeof block !== 'object') return null;

              if (block.type === 'heading') {
                return (
                  <h3
                    key={idx}
                    className="pa-h3"
                    style={{
                      marginTop: 34,
                      marginBottom: 14,
                      color: 'var(--pa-purple-deep)',
                    }}
                  >
                    {block.text}
                  </h3>
                );
              }

              if (block.type === 'subheading') {
                return (
                  <h4
                    key={idx}
                    style={{
                      marginTop: 22,
                      marginBottom: 10,
                      fontWeight: 700,
                      fontSize: 17,
                    }}
                  >
                    {block.text}
                  </h4>
                );
              }

              if (block.type === 'list') {
                return (
                  <ul
                    key={idx}
                    style={{
                      margin: '12px 0 20px',
                      paddingLeft: 22,
                      lineHeight: 1.75,
                      color: '#334155',
                    }}
                  >
                    {block.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: 8 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }

              // paragraph (default)
              return (
                <p
                  key={idx}
                  style={{
                    marginBottom: 16,
                    lineHeight: 1.8,
                    color: '#334155',
                  }}
                >
                  {block.text}
                </p>
              );
            })}
        </div>
      </div>
    </section>
  );
}