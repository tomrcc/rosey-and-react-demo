import { useEffect, useState } from "react";
import navigation from "@data/navigation.json";
import { generateRoseyId } from "rosey-connector/helpers/text-formatters.mjs"

export default function Navigation({ pageUrl }) {
  const [isSticky, setSticky] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);

  const pathname = pageUrl.pathname;
  const locale = pathname.split("/")[1];
  const allLocales = import.meta.glob('/rosey/locales/*.json', { eager: true });
  const localeData = allLocales[`/rosey/locales/${locale}.json`]?.default;
  console.log({localeData})

  const handleScroll = () => {
    setSticky(window.scrollY >= 70);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (event) => {
    const navbar = $("#mainnavigationBar");
    navbar.toggleClass("bg-nav");
  };

  
  const handleDropdownClick = (e) => {
    if (window.innerWidth >= 991.98) return;
  
    e.preventDefault();
  
    const parentDropdown = e.target.closest('.dropdown');
    if (!parentDropdown) return;
  
    const wasOpen = parentDropdown.classList.contains('show');

    document.querySelectorAll('.dropdown.show, .dropdown-menu.show').forEach(el => el.classList.remove('show'));
  
    if (!wasOpen) {
      parentDropdown.classList.add('show');
      parentDropdown.querySelector('.dropdown-menu').classList.add('show');
    }
  };
  
  

  return (
    <>
      <header>
        <nav
          className={`navbar navbar-expand-lg position-fixed w-100 zindex-dropdown${isSticky ? " sticky-nav" : ""}`}
          id="mainnavigationBar"
          data-rosey-ns="common"
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={navigation.logo} alt="Nav-Logo" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={handleClick}
            >
              <span className="navbar-toggler-default">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="3.5"
                    y1="5.5"
                    x2="21.5"
                    y2="5.5"
                    stroke="#292D32"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="4.5"
                    y1="12.5"
                    x2="21.5"
                    y2="12.5"
                    stroke="#292D32"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="11.5"
                    y1="19.5"
                    x2="21.5"
                    y2="19.5"
                    stroke="#292D32"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="navbar-toggler-toggled">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.5 6.5L6.5 21.5"
                    stroke="#404152"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.5 21.5L6.5 6.5"
                    stroke="#404152"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button> 
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav mx-auto mb-20 mb-lg-0">
              {navigation.items.map((item, i) => (
                <li key={i} className={`nav-item ${item.enable_dropdown && item.dropdown ? 'dropdown' : ''}`}>
                  {item.enable_dropdown && item.dropdown ? (
                    <>
                      <a
                        href={`${item.link}`}
                        className={`nav-link dropdown-link ${pageUrl?.pathname === item.link ? "active" : ""}`}
                        onClick={handleDropdownClick}
                        data-rosey={generateRoseyId(item.text)}
                      >
                        {!localeData ? item.text : localeData[`common:${generateRoseyId(item.text)}`].value}
                      </a>
                      <ul className="dropdown-menu">
                        {item.dropdown.map((dropdown_item, j) => (
                          <li key={j}>
                            <a
                              className="dropdown-item"
                              href={dropdown_item.dropdown_link}
                              data-rosey={generateRoseyId(dropdown_item.dropdown_text)}>
                              {!localeData ? dropdown_item.dropdown_text : localeData[`common:${generateRoseyId(dropdown_item.dropdown_text)}`].value}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a
                      href={`${item.link}`}
                      className={`nav-link ${pageUrl?.pathname === item.link ? "active" : ""}`}
                      data-rosey={generateRoseyId(item.text)}
                    >
                      {!localeData ? item.text : localeData[`common:${generateRoseyId(item.text)}`].value}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          { navigation.enable_nav_btn ? (
            <>
            <div className="d-none d-lg-block">
              <div className="nav-item">
                <a
                  href={`${navigation.nav_btn?.link}`}
                  className="btn btn-sm btn-links"
                  data-rosey={generateRoseyId(navigation.nav_btn?.text)}
                >
                  {!localeData ? navigation.nav_btn?.text : localeData[`common:${generateRoseyId(navigation.nav_btn?.text)}`].value}
                </a>
              </div>
            </div>
            </>
          ) : null }
          </div>
          <div className="language-picker">
            <button onClick={() => {
              setLangOpen(!isLangOpen)
            }}>
            Lang
          </button>
            <ul className="lang-list" style={isLangOpen ? {display: "flex"} : {display: "none"}}>
            {
              navigation.locales.map((locale) => {
                return (
                  <li key={locale.name}>
                    <a href={`/${locale.code}${pathname}`}>
                      <img
                        className="w-[32px]"
                        src={locale.flag}
                        alt={`${locale.name} Flag`}
                      />
                      <span>
                        {locale.name}
                      </span>
                    </a>
                  </li>
                );
              })
            }
          </ul>
        </div>
        </nav>
      </header>
    </>
  );
}
