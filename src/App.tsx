import {
  ArrowUpRight,
  BookOpenText,
  Broadcast,
  CaretRight,
  Check,
  DownloadSimple,
  LinkSimple,
  ShareNetwork,
  ShoppingCart,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

type LinkItem = {
  label: string;
  description: string;
  href: string;
  icon?: Icon;
  iconSrc?: string;
  featured?: boolean;
};

const mainLinks: LinkItem[] = [
  {
    label: "Belanja Buku di Website",
    description: "Katalog lengkap dan proses pesanan cepat",
    href: "https://store.gensaberilmu.com/",
    icon: ShoppingCart,
    featured: true,
  },
  {
    label: "Gabung Channel WhatsApp",
    description: "Info buku baru, kajian, dan program terbaru",
    href: "https://whatsapp.com/channel/0029VaSJ3ki7z4kYgFRzuT2N",
    iconSrc: "/whatsapp-logo.png",
  },
  {
    label: "Daftar Reseller dan Dropship",
    description: "Mulai bertumbuh bersama Gensa Berilmu",
    href: "https://desty.page/gensa.berilmu",
    iconSrc: "/reseller-icon.png",
  },
  {
    label: "Undang Ustadz Edgar Hamas",
    description: "Informasi agenda dan undangan kajian",
    href: "https://wa.me/6282258532347",
    iconSrc: "/google-calendar-icon.png",
  },
  {
    label: "Program Marketing Affiliate",
    description: "Bagikan manfaat, dapatkan penghasilan",
    href: "https://bit.ly/ikutmasarinprodukgensadong",
    iconSrc: "/affiliate-icon.png",
  },
  {
    label: "Chat Admin Gensa Berilmu",
    description: "Tanya produk dan bantuan pemesanan",
    href: "https://wa.me/6281384804494",
    iconSrc: "/whatsapp-logo.png",
  },
];

const marketplaceLinks: {
  label: string;
  href: string;
  icon?: Icon;
  iconSrc?: string;
}[] = [
  {
    label: "Tokopedia",
    href: "https://bit.ly/m/TokopediaSeller",
    iconSrc: "/tokopedia-mascot.png",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@gensa.berilmu?_t=8YopMrRuSHZ&_r=1",
    iconSrc: "/tiktok-logo.png",
  },
  {
    label: "Shopee",
    href: "https://linktr.ee/gensaberilmu",
    iconSrc: "/shopee-logo.png",
  },
];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function App() {
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      videoRef.current?.pause();
    } else {
      void videoRef.current?.play().catch(() => setVideoState("error"));
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    let resumeTimer: number;
    const resumePlayback = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        const video = videoRef.current;
        if (video && video.paused) {
          void video.play().catch(() => setVideoState("error"));
        }
      }, 220);
    };
    const pauseDuringScroll = () => {
      const video = videoRef.current;
      if (video && !video.paused) {
        video.pause();
      }
      resumePlayback();
    };

    window.addEventListener("scroll", pauseDuringScroll, { passive: true });
    window.addEventListener("touchmove", pauseDuringScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", pauseDuringScroll);
      window.removeEventListener("touchmove", pauseDuringScroll);
      window.clearTimeout(resumeTimer);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const sharePage = async () => {
    const shareData = {
      title: "Gensa Berilmu",
      text: "Temukan kanal resmi dan koleksi buku Gensa Berilmu.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotice("Tautan siap dibagikan");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("Tautan berhasil disalin");
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setNotice("Bagikan tautan dari menu browser Anda");
      }
    }
  };

  const saveContact = () => {
    const card = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Gensa Berilmu",
      "ORG:Penerbit Gensa Berilmu",
      "TEL;TYPE=WORK,VOICE:+6281384804494",
      "URL:https://gensaberilmu.com",
      "X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/gensa.berilmu",
      "END:VCARD",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gensa-berilmu.vcf";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Kontak Gensa Berilmu tersimpan");
  };

  return (
    <div className="site-shell" data-video-state={videoState}>
      <div className="background" aria-hidden="true">
        <video
          ref={videoRef}
          className="background__video"
          autoPlay={!reducedMotion}
          loop
          muted
          playsInline
          preload="auto"
          poster="/al-aqsa-poster.jpg"
          onCanPlay={() => setVideoState("ready")}
          onError={() => setVideoState("error")}
        >
          <source src="/al-aqsa-motion-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/al-aqsa-motion.mp4" type="video/mp4" />
        </video>
        <div className="background__fallback" />
        <div className="background__scrim" />
        <div className="background__grain" />
      </div>

      <main className="profile">
        <header className="profile__header entrance" style={{ "--delay": "40ms" } as React.CSSProperties}>
          <div className="brand-mark">
            <img src="/icon.png" alt="Logo Gensa Berilmu" width="74" height="74" />
          </div>
          <p className="eyebrow">Penerbit Buku Islam</p>
          <h1>Gensa Berilmu</h1>
          <p className="tagline">Buku yang menyalakan ilmu dan menumbuhkan amal.</p>
        </header>

        <section
          className="quick-actions entrance"
          aria-label="Aksi cepat"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <button type="button" onClick={saveContact}>
            <DownloadSimple size={19} weight="bold" />
            <span>Simpan Kontak</span>
          </button>
          <button type="button" onClick={sharePage}>
            <ShareNetwork size={19} weight="bold" />
            <span>Bagikan</span>
          </button>
        </section>

        <nav className="link-list" aria-label="Tautan utama Gensa Berilmu">
          {mainLinks.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <a
                className={`link-card entrance${item.featured ? " link-card--featured" : ""}`}
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
                style={{ "--delay": `${160 + index * 60}ms` } as React.CSSProperties}
              >
                <span className="link-card__icon">
                  {item.iconSrc ? (
                    <img
                      className="link-card__icon-image"
                      src={item.iconSrc}
                      alt=""
                      width={23}
                      height={23}
                    />
                  ) : (
                    ItemIcon && (
                      <ItemIcon size={23} weight={item.featured ? "fill" : "regular"} />
                    )
                  )}
                </span>
                <span className="link-card__copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
                <CaretRight className="link-card__arrow" size={20} weight="bold" />
              </a>
            );
          })}
        </nav>

        <section
          className="social-row entrance"
          aria-label="Media sosial resmi"
          style={{ "--delay": "560ms" } as React.CSSProperties}
        >
          <a href="https://instagram.com/gensa.berilmu" target="_blank" rel="noreferrer">
            <img
              className="social-row__icon-image"
              src="/instagram-logo.png"
              alt=""
              width={23}
              height={23}
            />
            <span>Instagram</span>
            <ArrowUpRight size={17} weight="bold" />
          </a>
          <a
            href="https://youtube.com/channel/UC8tIGvFz0zClZ588XeJtVGg"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="social-row__icon-image"
              src="/youtube-logo.png"
              alt=""
              width={23}
              height={23}
            />
            <span>YouTube</span>
            <ArrowUpRight size={17} weight="bold" />
          </a>
        </section>

        <section
          className="marketplace entrance"
          aria-labelledby="marketplace-heading"
          style={{ "--delay": "620ms" } as React.CSSProperties}
        >
          <div className="section-heading">
            <BookOpenText size={22} weight="duotone" />
            <h2 id="marketplace-heading">Temukan kami di marketplace</h2>
          </div>
          <div className="marketplace__grid">
            {marketplaceLinks.map((item) => {
              const ItemIcon = item.icon;
              return (
                <a href={item.href} key={item.label} target="_blank" rel="noreferrer">
                  {item.iconSrc ? (
                    <img
                      className="marketplace__icon-image"
                      src={item.iconSrc}
                      alt=""
                      width={25}
                      height={25}
                    />
                  ) : (
                    ItemIcon && <ItemIcon size={25} weight="duotone" />
                  )}
                  <span>{item.label}</span>
                  <ArrowUpRight size={16} weight="bold" />
                </a>
              );
            })}
          </div>
        </section>

        <footer className="footer entrance" style={{ "--delay": "680ms" } as React.CSSProperties}>
          <img src="/icon.png" alt="" width="23" height="23" />
          <p>© 2026 Gensa Berilmu. Semua hak dilindungi.</p>
          <a href="https://gensaberilmu.com" aria-label="Buka gensaberilmu.com">
            <LinkSimple size={18} />
          </a>
        </footer>
      </main>

      <div className={`toast${notice ? " toast--visible" : ""}`} role="status" aria-live="polite">
        <Check size={18} weight="bold" />
        <span>{notice}</span>
      </div>
    </div>
  );
}

export default App;
