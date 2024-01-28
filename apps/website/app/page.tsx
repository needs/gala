import './animate.css';
import './glightbox.min.css';
import './lineicons.css';
import './bootstrap.min.css';
import './style.css';

import Script from 'next/script';
import Image from 'next/image';
import prisma from '../utils/prisma';
import { cache } from 'react';

export const revalidate = 120;

const getStats = cache(async () => {
  const competitionAggregation = await prisma.competition.aggregate({
    _sum: {
      cumulativeDuration: true,
      playerCount: true,
      viewCount: true,
    },
  });

  return competitionAggregation._sum;
});

export default async function Page() {
  const isIe = false;
  const isLoading = false;

  const { playerCount, cumulativeDuration, viewCount } = await getStats();

  return (
    <html lang="en">
      <head>
        <title>tgym.fr - Les compétitions faciles</title>

        <meta
          name="description"
          content="Organisez facilement vos compétitions et gala de gymnastique.  Planifiez vos rotations, gérez les écrans de votre salle, affichez les prix de la buvette."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="shortcut icon" href="/images/favicon.png" type="image/png" />
      </head>

      <body>
        {isIe && (
          <p className="browserupgrade">
            Vous utilisez un navigateur <strong>obsolète</strong>. Essayez un
            <a href="https://browsehappy.com/">navigateur plus récent</a> pour
            améliorer votre expérience.
          </p>
        )}

        {isLoading && (
          <div className="preloader">
            <div className="loader">
              <div className="spinner">
                <div className="spinner-container">
                  <div className="spinner-rotator">
                    <div className="spinner-left">
                      <div className="spinner-circle"></div>
                    </div>
                    <div className="spinner-right">
                      <div className="spinner-circle"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <header className="header-area">
          <div className="navbar-area">
            <div className="container" style={{ paddingBottom: 0 }}>
              <div className="row">
                <div className="col-lg-12">
                  <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="/">
                      <Image
                        src="/images/logo/logo.png"
                        alt="Logo"
                        width={118}
                        height={50}
                      />
                    </a>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="toggler-icon"> </span>
                      <span className="toggler-icon"> </span>
                      <span className="toggler-icon"> </span>
                    </button>

                    <div
                      className="collapse navbar-collapse sub-menu-bar"
                      id="navbarSupportedContent"
                    >
                      <ul id="nav" className="navbar-nav ms-auto">
                        <li className="nav-item">
                          <a className="page-scroll active" href="#home">
                            Accueil
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#features">
                            Fonctionalités
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#facts">
                            Statistiques
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div className="navbar-btn d-none d-sm-inline-block">
                      <a
                        className="main-btn"
                        data-scroll-nav="0"
                        href="https://app.tgym.fr/"
                      >
                        Ouvrir
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div
            id="home"
            className="header-hero bg_cover"
            style={{
              backgroundImage: 'url(/images/header/banner-bg.svg)',
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="header-hero-content text-center">
                    <h3
                      className="header-sub-title wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.2s"
                    >
                      TGym - Le gala facile
                    </h3>
                    <h2
                      className="header-title wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.5s"
                    >
                      Organisez vos compétitions et galas de gym
                    </h2>
                    <p
                      className="text wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.8s"
                    >
                      Gestion collaborative des joueurs, des équipes, des
                      rotations, des écrans et de la buvette
                    </p>
                    <a
                      href="https://app.tgym.fr/"
                      className="main-btn wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="1.1s"
                    >
                      Essayer
                    </a>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="header-hero-image text-center wow fadeIn"
                    data-wow-duration="1.3s"
                    data-wow-delay="1.4s"
                  >
                    <img src="/images/header/header-hero2.png" alt="hero" />
                  </div>
                </div>
              </div>
            </div>
            <div id="particles-1" className="particles"></div>
          </div>
        </header>

        {/*<div className="brand-area pt-90">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="
                    brand-logo
                    d-flex
                    align-items-center
                    justify-content-center justify-content-md-between
                  "
                >
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.2s"
                  >
                    <img src="/images/brands/uideck.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.2s"
                  >
                    <img src="/images/brands/ayroui.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.3s"
                  >
                    <img src="/images/brands/graygrids.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.4s"
                  >
                    <img src="/images/brands/lineicons.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.5s"
                  >
                    <img
                      src="/images/brands/ecommerce-html.svg"
                      alt="brand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>*/}

        <section id="features" className="services-area pt-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-title text-center pb-40">
                  <div className="line m-auto"></div>
                  <h3 className="title">
                    Simple et collaboratif,
                    <span> commencez dès maintenant !</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-7 col-sm-8">
                <div
                  className="single-services text-center mt-30 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.2s"
                >
                  <div className="services-icon">
                    <img
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <img
                      className="shape-1"
                      src="/images/services/services-shape-1.svg"
                      alt="shape"
                    />
                    <i className="lni lni-baloon"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">Épuré</h4>
                    <p className="text">
                      {
                        "Tgym se concentre sur l'essentiel : la gestion des compétitions et des galas de gymnastique."
                      }
                    </p>
                    {/*<a className="more" href="https://app.tgym.fr/">
                      Learn More <i className="lni lni-chevron-right"> </i>
        </a>*/}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7 col-sm-8">
                <div
                  className="single-services text-center mt-30 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.5s"
                >
                  <div className="services-icon">
                    <img
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <img
                      className="shape-1"
                      src="/images/services/services-shape-2.svg"
                      alt="shape"
                    />
                    <i className="lni lni-cog"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">Simple</h4>
                    <p className="text">
                      {
                        "Tgym est simple d'utilisation et ne nécessite aucune formation."
                      }
                    </p>
                    {/*<a className="more" href="https://app.tgym.fr/">
                      Learn More <i className="lni lni-chevron-right"> </i>
      </a>*/}
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-7 col-sm-8">
                <div
                  className="single-services text-center mt-30 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.8s"
                >
                  <div className="services-icon">
                    <img
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <img
                      className="shape-1"
                      src="/images/services/services-shape-3.svg"
                      alt="shape"
                    />
                    <i className="lni lni-bolt-alt"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">Puissant</h4>
                    <p className="text">
                      {
                        "Collaboratif est le plus complet possible, sans sacrifier l'ergonomie."
                      }
                    </p>
                    {/*<a className="more" href="https://app.tgym.fr/">
                      Learn More <i className="lni lni-chevron-right"> </i>
    </a>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="about-area pt-70">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div
                    className="about-content mt-50 wow fadeInLeftBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <div className="section-title">
                      <div className="line"></div>
                      <h3 className="title">
                        Facile & Rapide <span>et complètement gratuit</span>
                      </h3>
                    </div>
                    <p className="text">
                      {
                        "Conçut avec des technologies modernes et résiliente.  Toutes les données sont sauvegardées en temps réel et sont accessibles depuis n'importe quel appareil.  Plusieurs personnes peuvent travailler en même temps sur le même événement."
                      }
                    </p>
                    <a href="https://app.tgym.fr/" className="main-btn">
                      Essayer gratuitement
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <img src="/images/about/about1.svg" alt="about" />
                  </div>
                </div>
              </div>
            </div>
            <div className="about-shape-1">
              <img src="/images/about/about-shape-1.svg" alt="shape" />
            </div>
          </div>

          <div className="about-area pt-70">
            <div className="about-shape-2">
              <img src="/images/about/about-shape-2.svg" alt="shape" />
            </div>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 order-lg-last">
                  <div
                    className="about-content ms-lg-auto mt-50 wow fadeInLeftBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <div className="section-title">
                      <div className="line"></div>
                      <h3 className="title">
                        Complet <span> et en constante évolution</span>
                      </h3>
                    </div>
                    <p className="text">
                      {
                        "Tgym est en constante évolution et utilisé régulièrement pour organiser des compétitions.  Tgym est conçut pour évoluer rapidemment et s'adapter à vos nouveau besoins.  Enfin Tgym est gratuit et le restera."
                      }
                    </p>
                    <a href="https://app.tgym.fr/" className="main-btn">
                      Essayer gratuitement
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 order-lg-first">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <img src="/images/about/about2.svg" alt="about" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-area pt-70">
            <div className="container">
              <div className="row">
                <div className="col-lg-6">
                  <div
                    className="about-content mt-50 wow fadeInLeftBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <div className="section-title">
                      <div className="line"></div>
                      <h3 className="title">
                        <span>Créé pour</span> les bénévoles, par des bénévoles
                      </h3>
                    </div>
                    <p className="text">
                      {
                        "Pensé pour être utilisé même par des novices en informatique.  Tgym est conçut pour être utilisé par des bénévoles, sans formation et sans assistance.  Tgym est gratuit et le restera.  Notre but est de simplement rendre l'organisation des compétition plus facile et apporter aux spectateurs et gymnastes un meilleur confort."
                      }
                    </p>
                    <a href="https://app.tgym.fr/" className="main-btn">
                      Essayer gratuitement
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <img src="/images/about/about3.svg" alt="about" />
                  </div>
                </div>
              </div>
            </div>
            <div className="about-shape-1">
              <img src="/images/about/about-shape-1.svg" alt="shape" />
            </div>
          </div>
        </section>

        <section id="facts" className="video-counter pt-70">
          <div className="container">
            <div className="row">
              <div className="order-lg-last">
                <div
                  className="counter-wrapper mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.8s"
                >
                  <div className="counter-content">
                    <div className="section-title">
                      <div className="line"></div>
                      <h3 className="title">
                        Quelques statistiques <span> sur Tgym</span>
                      </h3>
                    </div>
                    <p className="text">
                      {"La meilleure façon de découvrir Tgym est de l'essayer."}
                    </p>
                  </div>
                  <div className="row no-gutters">
                    <div className="col-4">
                      <div
                        className="
                          single-counter
                          counter-color-1
                          d-flex
                          align-items-center
                          justify-content-center
                        "
                      >
                        <div className="counter-items text-center">
                          <span
                            className="count countup text-uppercase"
                            cup-end={(playerCount ?? 0).toString()}
                            cup-append=""
                          ></span>

                          <p className="text">Joueurs</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className="
                          single-counter
                          counter-color-2
                          d-flex
                          align-items-center
                          justify-content-center
                        "
                      >
                        <div className="counter-items text-center">
                          <span
                            className="count countup text-uppercase"
                            cup-end={(
                              (cumulativeDuration ?? 0) / 60
                            ).toString()}
                            cup-append=""
                          ></span>
                          <p className="text">Heures</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div
                        className="
                          single-counter
                          counter-color-3
                          d-flex
                          align-items-center
                          justify-content-center
                        "
                      >
                        <div className="counter-items text-center">
                          <span
                            className="count countup text-uppercase"
                            cup-end={(
                              (viewCount ?? 0)
                            ).toString()}
                            cup-append=""
                          ></span>
                          <p className="text">Vues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="footer" className="footer-area pt-120">
          <div className="container">
            <div
              className="subscribe-area wow fadeIn"
              data-wow-duration="1s"
              data-wow-delay="0.5s"
            >
              <div className="row">
                <div className="col-lg-6">
                  <div className="subscribe-content mt-45">
                    <h2 className="subscribe-title">
                      Essayer tgym{' '}
                      <span>et créer votre première compétition</span>
                    </h2>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="subscribe-form mt-50">
                    <button className="main-btn">Essayer</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-widget pb-100">
              <div className="row">
                <div className="col-lg-8 col-md-6 col-sm-8">
                  <div
                    className="footer-about mt-50 wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.2s"
                  >
                    <a className="logo" href="/">
                      <Image
                        src="/images/logo/logo.png"
                        alt="logo"
                        width={160}
                        height={68}
                      />
                    </a>
                    <p className="text">
                      {
                        "N'hésitez pas à prendre contact pour demander de l'aide, poser vos questions ou proposer des améliorations."
                      }
                    </p>
                    {/*<ul className="social">
                      <li>
                        <a href="https://app.tgym.fr/">
                          <i className="lni lni-facebook-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="https://app.tgym.fr/">
                          <i className="lni lni-twitter-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="https://app.tgym.fr/">
                          <i className="lni lni-instagram-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="https://app.tgym.fr/">
                          <i className="lni lni-linkedin-original"> </i>
                        </a>
                      </li>
  </ul>*/}
                  </div>
                </div>
                {/*<div className="col-lg-5 col-md-7 col-sm-12">
                  <div className="footer-link d-flex mt-50 justify-content-sm-between">
                    <div
                      className="link-wrapper wow fadeIn"
                      data-wow-duration="1s"
                      data-wow-delay="0.4s"
                    >
                      <div className="footer-title">
                        <h4 className="title">Quick Link</h4>
                      </div>
                      <ul className="link">
                        <li>
                          <a href="https://app.tgym.fr/">Road Map</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Refund Policy</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Terms of Service</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Pricing</a>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="link-wrapper wow fadeIn"
                      data-wow-duration="1s"
                      data-wow-delay="0.6s"
                    >
                      <div className="footer-title">
                        <h4 className="title">Resources</h4>
                      </div>
                      <ul className="link">
                        <li>
                          <a href="https://app.tgym.fr/">Home</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Page</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Portfolio</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Blog</a>
                        </li>
                        <li>
                          <a href="https://app.tgym.fr/">Contact</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>*/}
                <div className="col-lg-3 col-md-5 col-sm-12">
                  <div
                    className="footer-contact mt-50 wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.8s"
                  >
                    <div className="footer-title">
                      <h4 className="title">Email</h4>
                    </div>
                    <ul className="contact">
                      <li>timothee.vialatoux@gmail.com</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="row">
                <div className="col-lg-12">
                  <div className="copyright d-sm-flex justify-content-between">
                    <div className="copyright-content">
                      <p className="text">
                        Créé et maintenu par Timothée Vialatoux
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="particles-2"></div>
        </footer>

        <a href="#" className="back-to-top">
          {' '}
          <i className="lni lni-chevron-up"> </i>{' '}
        </a>

        <Script src="/js/bootstrap.bundle.min.js"></Script>
        <Script src="/js/wow.min.js"></Script>
        <Script src="/js/glightbox.min.js"></Script>
        <Script src="/js/count-up.min.js"></Script>
        <Script src="/js/particles.min.js"></Script>
        <Script src="/js/main.js"></Script>
      </body>
    </html>
  );
}
