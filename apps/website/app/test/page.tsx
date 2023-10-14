import "./animate.css"
import "./glightbox.min.css"
import "./lineicons.css"
import "./bootstrap.min.css"
import "./style.css"

import Script from "next/script"
import Image from "next/image"

export default function Page() {
  const isIe = false;
  const isLoading = false;

  return (
    <html lang="en">
      <head>
        <title>Basic - SaaS Landing Page</title>

        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link
          rel="shortcut icon"
          href="/images/favicon.png"
          type="image/png"
        />
      </head>

      <body>
        {isIe && (
          <p className="browserupgrade">
            You are using an <strong>outdated</strong> browser. Please
            <a href="https://browsehappy.com/">upgrade your browser</a> to
            improve your experience and security.
          </p>
        )}

        {isLoading && (<div className="preloader">
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
        </div>)}

        <header className="header-area">
          <div className="navbar-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="index.html">
                      <Image src="/images/logo/logo.svg" alt="Logo" />
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
                            Home
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#features">
                            Features
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#about">
                            About
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="page-scroll" href="#facts">
                            Why
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="/">Team</a>
                        </li>
                        <li className="nav-item">
                          <a href="/">Blog</a>
                        </li>
                      </ul>
                    </div>

                    <div className="navbar-btn d-none d-sm-inline-block">
                      <a
                        className="main-btn"
                        data-scroll-nav="0"
                        href="https://uideck.com/templates/basic/"
                        rel="nofollow"
                      >
                        Download Now
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
                      Basic - SaaS Landing Page
                    </h3>
                    <h2
                      className="header-title wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.5s"
                    >
                      Kickstart Your SaaS or App Site
                    </h2>
                    <p
                      className="text wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="0.8s"
                    >
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      sed diam nonumy eirmod tempor
                    </p>
                    <a
                      href="/"
                      className="main-btn wow fadeInUp"
                      data-wow-duration="1.3s"
                      data-wow-delay="1.1s"
                    >
                      Get Started
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
                    <Image
                      src="/images/header/header-hero.png"
                      alt="hero"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div id="particles-1" className="particles"></div>
          </div>
        </header>

        <div className="brand-area pt-90">
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
                    <Image src="/images/brands/uideck.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.2s"
                  >
                    <Image src="/images/brands/ayroui.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.3s"
                  >
                    <Image src="/images/brands/graygrids.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.4s"
                  >
                    <Image src="/images/brands/lineicons.svg" alt="brand" />
                  </div>
                  <div
                    className="single-logo mt-30 wow fadeIn"
                    data-wow-duration="1.5s"
                    data-wow-delay="0.5s"
                  >
                    <Image
                      src="/images/brands/ecommerce-html.svg"
                      alt="brand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="features" className="services-area pt-120">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="section-title text-center pb-40">
                  <div className="line m-auto"></div>
                  <h3 className="title">
                    Clean and simple design,
                    <span> Comes with everything you need to get started!</span>
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
                    <Image
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <Image
                      className="shape-1"
                      src="/images/services/services-shape-1.svg"
                      alt="shape"
                    />
                    <i className="lni lni-baloon"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">
                      <a href="/">Clean</a>
                    </h4>
                    <p className="text">
                      Lorem ipsum dolor sit amet,consetetur sadipscing elitr,
                      seddiam nonu eirmod tempor invidunt labore.
                    </p>
                    <a className="more" href="/">
                      Learn More <i className="lni lni-chevron-right"> </i>
                    </a>
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
                    <Image
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <Image
                      className="shape-1"
                      src="/images/services/services-shape-2.svg"
                      alt="shape"
                    />
                    <i className="lni lni-cog"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">
                      <a href="/">Robust</a>
                    </h4>
                    <p className="text">
                      Lorem ipsum dolor sit amet,consetetur sadipscing elitr,
                      seddiam nonu eirmod tempor invidunt labore.
                    </p>
                    <a className="more" href="/">
                      Learn More <i className="lni lni-chevron-right"> </i>
                    </a>
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
                    <Image
                      className="shape"
                      src="/images/services/services-shape.svg"
                      alt="shape"
                    />
                    <Image
                      className="shape-1"
                      src="/images/services/services-shape-3.svg"
                      alt="shape"
                    />
                    <i className="lni lni-bolt-alt"> </i>
                  </div>
                  <div className="services-content mt-30">
                    <h4 className="services-title">
                      <a href="/">Powerful</a>
                    </h4>
                    <p className="text">
                      Lorem ipsum dolor sit amet,consetetur sadipscing elitr,
                      seddiam nonu eirmod tempor invidunt labore.
                    </p>
                    <a className="more" href="/">
                      Learn More <i className="lni lni-chevron-right"> </i>
                    </a>
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
                        Quick & Easy <span>to Use Bootstrap Template</span>
                      </h3>
                    </div>
                    <p className="text">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      seiam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua. At vero eos et
                      accusam et justo duo dolores et ea rebum. Stet clita kasd
                      gubergren, no sea takimata sanctus est Lorem ipsum dolor
                      sit amet. Lorem ipsum dolor sit amet, consetetur
                      sadipscing.
                    </p>
                    <a href="/" className="main-btn">
                      Try it Free
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <Image src="/images/about/about1.svg" alt="about" />
                  </div>
                </div>
              </div>
            </div>
            <div className="about-shape-1">
              <Image src="/images/about/about-shape-1.svg" alt="shape" />
            </div>
          </div>

          <div className="about-area pt-70">
            <div className="about-shape-2">
              <Image src="/images/about/about-shape-2.svg" alt="shape" />
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
                        Modern design <span> with Essential Features</span>
                      </h3>
                    </div>
                    <p className="text">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      seiam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua. At vero eos et
                      accusam et justo duo dolores et ea rebum. Stet clita kasd
                      gubergren, no sea takimata sanctus est Lorem ipsum dolor
                      sit amet. Lorem ipsum dolor sit amet, consetetur
                      sadipscing.
                    </p>
                    <a href="/" className="main-btn">
                      Try it Free
                    </a>
                  </div>
                </div>
                <div className="col-lg-6 order-lg-first">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <Image src="/images/about/about2.svg" alt="about" />
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
                        <span>Crafted for</span> SaaS, App and Software Landing
                        Page
                      </h3>
                    </div>
                    <p className="text">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      seiam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua. At vero eos et
                      accusam et justo duo dolores et ea rebum. Stet clita kasd
                      gubergren, no sea takimata sanctus est Lorem ipsum dolor
                      sit amet. Lorem ipsum dolor sit amet, consetetur
                      sadipscing.
                    </p>
                    <a href="/" className="main-btn">
                      Try it Free
                    </a>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="about-image text-center mt-50 wow fadeInRightBig"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <Image src="/images/about/about3.svg" alt="about" />
                  </div>
                </div>
              </div>
            </div>
            <div className="about-shape-1">
              <Image src="/images/about/about-shape-1.svg" alt="shape" />
            </div>
          </div>
        </section>

        <section id="facts" className="video-counter pt-70">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 order-lg-last">
                <div
                  className="counter-wrapper mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.8s"
                >
                  <div className="counter-content">
                    <div className="section-title">
                      <div className="line"></div>
                      <h3 className="title">
                        Cool facts <span> about this app</span>
                      </h3>
                    </div>
                    <p className="text">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                      seiam nonumy eirmod tempor invidunt ut labore et dolore
                      magna aliquyam erat, sed diam voluptua.
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
                            cup-end="125"
                          ></span>

                          <p className="text">Downloads</p>
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
                            cup-end="87"
                          ></span>
                          <p className="text">Active Users</p>
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
                            cup-end="59"
                          ></span>
                          <p className="text">User Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div
                  className="video-content mt-50 wow fadeIn"
                  data-wow-duration="1s"
                  data-wow-delay="0.5s"
                >
                  <Image
                    className="dots"
                    src="/images/video/dots.svg"
                    alt="dots"
                  />
                  <div className="video-wrapper">
                    <div className="video-image">
                      <Image src="/images/video/video.png" alt="video" />
                    </div>
                    <div className="video-icon">
                      <a
                        href="https://www.youtube.com/watch?v=r44RKWyfcFw"
                        className="video-popup glightbox"
                      >
                        <i className="lni lni-play"> </i>
                      </a>
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
                      Subscribe Our Newsletter <span>get reguler updates</span>
                    </h2>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="subscribe-form mt-50">
                    <form action="#">
                      <input type="text" placeholder="Enter eamil" />
                      <button className="main-btn">Subscribe</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-widget pb-100">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-8">
                  <div
                    className="footer-about mt-50 wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.2s"
                  >
                    <a className="logo" href="/">
                      <Image src="/images/logo/logo.svg" alt="logo" />
                    </a>
                    <p className="text">
                      Lorem ipsum dolor sit amet consetetur sadipscing elitr,
                      sederfs diam nonumy eirmod tempor invidunt ut labore et
                      dolore magna aliquyam.
                    </p>
                    <ul className="social">
                      <li>
                        <a href="/">
                          <i className="lni lni-facebook-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="lni lni-twitter-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="lni lni-instagram-filled"> </i>
                        </a>
                      </li>
                      <li>
                        <a href="/">
                          <i className="lni lni-linkedin-original"> </i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-5 col-md-7 col-sm-12">
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
                          <a href="/">Road Map</a>
                        </li>
                        <li>
                          <a href="/">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="/">Refund Policy</a>
                        </li>
                        <li>
                          <a href="/">Terms of Service</a>
                        </li>
                        <li>
                          <a href="/">Pricing</a>
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
                          <a href="/">Home</a>
                        </li>
                        <li>
                          <a href="/">Page</a>
                        </li>
                        <li>
                          <a href="/">Portfolio</a>
                        </li>
                        <li>
                          <a href="/">Blog</a>
                        </li>
                        <li>
                          <a href="/">Contact</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-5 col-sm-12">
                  <div
                    className="footer-contact mt-50 wow fadeIn"
                    data-wow-duration="1s"
                    data-wow-delay="0.8s"
                  >
                    <div className="footer-title">
                      <h4 className="title">Contact Us</h4>
                    </div>
                    <ul className="contact">
                      <li>+809272561823</li>
                      <li>info@gmail.com</li>
                      <li>www.yourweb.com</li>
                      <li>
                        123 Stree New York City , United <br />
                        States Of America 750.
                      </li>
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
                        Designed and Developed by
                        <a href="https://uideck.com" rel="nofollow">
                          UIdeck
                        </a>
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
