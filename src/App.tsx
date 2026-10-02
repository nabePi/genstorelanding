import { ArrowUpRight, CaretRight, Check, DownloadSimple, LinkSimple, ShareNetwork, BookOpenText } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { content, ICONS } from "./content";
import type { IconName } from "./content";

const { hero, background, quickActions, marketplace, footer } = content;
const mainLinks = content.links.filter((item) => item.visible);
const socialLinks = content.social.filter((item) => item.visible);
const marketplaceLinks = marketplace.items.filter((item) => item.visible);

function renderIcon(icon: IconName | undefined, size: number, weight: "regular" | "fill" | "duotone" = "regular") {
  const Component = icon ? ICONS[icon] : undefined;
  return Component ? <Component size={size} weight={weight} /> : null;
}

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
      title: quickActions.share.title,
      text: quickActions.share.text,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotice(quickActions.share.toastShared);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice(quickActions.share.toastCopied);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setNotice(quickActions.share.toastFallback);
      }
    }
  };

  const saveContact = () => {
    const { vcard } = quickActions.saveContact;
    const card = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${vcard.name}`,
      `ORG:${vcard.org}`,
      `TEL;TYPE=WORK,VOICE:${vcard.phone}`,
      `URL:${vcard.url}`,
      `X-SOCIALPROFILE;TYPE=instagram:${vcard.instagram}`,
      "END:VCARD",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([card], { type: "text/vcard" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gensa-berilmu.vcf";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice(quickActions.saveContact.toast);
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
          poster={background.poster}
          onCanPlay={() => setVideoState("ready")}
          onError={() => setVideoState("error")}
        >
          <source src={background.videoDesktop} type="video/mp4" media="(min-width: 768px)" />
          <source src={background.videoMobile} type="video/mp4" />
        </video>
        <div className="background__fallback" />
        <div className="background__scrim" />
        <div className="background__grain" />
      </div>

      <main className="profile">
        <header className="profile__header entrance" style={{ "--delay": "40ms" } as React.CSSProperties}>
          <div className="brand-mark">
            <img src={hero.logo} alt={hero.logoAlt} width="74" height="74" />
          </div>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className="tagline">{hero.tagline}</p>
        </header>

        <section
          className="quick-actions entrance"
          aria-label="Aksi cepat"
          style={{ "--delay": "100ms" } as React.CSSProperties}
        >
          <button type="button" onClick={saveContact}>
            <DownloadSimple size={19} weight="bold" />
            <span>{quickActions.saveContact.label}</span>
          </button>
          <button type="button" onClick={sharePage}>
            <ShareNetwork size={19} weight="bold" />
            <span>{quickActions.share.label}</span>
          </button>
        </section>

        <nav className="link-list" aria-label="Tautan utama Gensa Berilmu">
          {mainLinks.map((item, index) => (
            <a
              className={`link-card entrance${item.featured ? " link-card--featured" : ""}`}
              href={item.href}
              key={item.id}
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
                  renderIcon(item.icon, 23, item.featured ? "fill" : "regular")
                )}
              </span>
              <span className="link-card__copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <CaretRight className="link-card__arrow" size={20} weight="bold" />
            </a>
          ))}
        </nav>

        <section
          className="social-row entrance"
          aria-label="Media sosial resmi"
          style={{ "--delay": "560ms" } as React.CSSProperties}
        >
          {socialLinks.map((item) => (
            <a href={item.href} key={item.id} target="_blank" rel="noreferrer">
              {item.iconSrc ? (
                <img
                  className="social-row__icon-image"
                  src={item.iconSrc}
                  alt=""
                  width={23}
                  height={23}
                />
              ) : (
                renderIcon(item.icon, 23)
              )}
              <span>{item.label}</span>
              <ArrowUpRight size={17} weight="bold" />
            </a>
          ))}
        </section>

        <section
          className="marketplace entrance"
          aria-labelledby="marketplace-heading"
          style={{ "--delay": "620ms" } as React.CSSProperties}
        >
          <div className="section-heading">
            <BookOpenText size={22} weight="duotone" />
            <h2 id="marketplace-heading">{marketplace.heading}</h2>
          </div>
          <div className="marketplace__grid">
            {marketplaceLinks.map((item) => (
              <a href={item.href} key={item.id} target="_blank" rel="noreferrer">
                {item.iconSrc ? (
                  <img
                    className="marketplace__icon-image"
                    src={item.iconSrc}
                    alt=""
                    width={25}
                    height={25}
                  />
                ) : (
                  renderIcon(item.icon, 25, "duotone")
                )}
                <span>{item.label}</span>
                <ArrowUpRight size={16} weight="bold" />
              </a>
            ))}
          </div>
        </section>

        <footer className="footer entrance" style={{ "--delay": "680ms" } as React.CSSProperties}>
          <img src={footer.icon} alt="" width="23" height="23" />
          <p>{footer.text}</p>
          <a href={footer.siteUrl} aria-label={`Buka ${new URL(footer.siteUrl).host}`}>
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
