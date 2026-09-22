// src/app/contacto/page.tsx — versión final limpia
import ContactSection from '@/components/home/ContactSection';

export default function ContactPage() {
  return (
    <>
      <section className="pa-section" style={{ paddingBottom: 20 }}>
        <div className="pa-dot-grid" />
        <div className="pa-container pa-center">
          <span className="pa-eyebrow">
            <i className="bi bi-geo-alt-fill" /> PublicidadActiva
          </span>
          <h1 className="pa-h1">Contáctanos</h1>
          <div className="pa-map-wrap">
            <iframe
              title="PublicidadActiva location"
              src="https://www.google.com/maps?q=Avenida+Gustavo+Baz+Prada+166,+La+Escuela,+Tlalnepantla+de+Baz,+México&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
      <ContactSection />
    </>
  );
}