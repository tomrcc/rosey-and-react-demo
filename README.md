# Rosey & React Demo

This demo shows a workaround for using Rosey translations in a JavaScript hydrated component - in this case the `src/components/layouts/navigation.jsx` file.

Without the workaround, the translated values appear briefly on the screen, and then when the component rerenders are blown away and replaced with the original. We need to include the translations as part of the logic of the component.

To do this we:

1. Import the locales/*.json files that the Rosey CloudCannon Connector has created for us which Rosey uses to insert translations onto the page. We can import the files with the line:
```javascript
const allLocales = import.meta.glob('/rosey/locales/*.json', { eager: true });
```
2. Find the locale through the url string of the page. In this example we use the following logic:
```javascript
useEffect(() => {
   const pathname = window.location.pathname;
   const locale = pathname.split("/")[1];

   ...
   }, []);
```
3. Once we find the locale, we can grab the data from the appropriate file using the line, and set the data as state - like in the following example:
```javascript
const [localeData, setLocaleData] = useState(false);
const allLocales = import.meta.glob('/rosey/locales/*.json', { eager: true });

   ...

useEffect(() => {
   const pathname = window.location.pathname;
   const locale = pathname.split("/")[1];
   setLocaleData(allLocales[`/rosey/locales/${locale}.json`]?.default);

   ...
}, []);

```
4. Then when we display the text in each nav link item, we can check for whether there is any corresponding translation in the locale data for the tagged element. If no locale data exists we can use the original text. If it does exists, we can use the content as a key to check if theres a translation in the locale data. This example has a namespace of common, which we've defined earlier since we're in the header which will be used on all pages. We need to make sure to use the `value`, as the locale data consists of objects which contain an `original`, and a `value` for each translation.

```javascript
<a
   href={`${item.link}`}
   data-rosey={generateRoseyId(item.text)}
   >
   {!localeData ? item.text : localeData[`common:${generateRoseyId(item.text)}`]?.value}
</a>
```

5. Putting it all together, and stripping out a lot of the extra navigation and styling fluff that doesn't relate to translations in this file will look like:

```javascript
import { useEffect, useState } from "react";
import navigation from "@data/navigation.json";
import { generateRoseyId } from "rosey-connector/helpers/text-formatters.mjs"

export default function Navigation({ pageUrl, pagePathname }) {
  const [isLangOpen, setLangOpen] = useState(false);
  const [localeData, setLocaleData] = useState(false);
  const allLocales = import.meta.glob('/rosey/locales/*.json', { eager: true });
  
  useEffect(() => {
    const pathname = window.location.pathname;
    const locale = pathname.split("/")[1];
    setLocaleData(allLocales[`/rosey/locales/${locale}.json`]?.default);
  }, []);

  return (
    <>
      <header>
        <nav data-rosey-ns="common">
          <div>
            <a className="navbar-brand" href="/">
              <img src={navigation.logo} alt="Nav-Logo" />
            </a>
            <div>
              <ul>
                {navigation.items.map((item, i) => (
                  <li key={i}>
                    {item.enable_dropdown && item.dropdown ? (
                      <>
                        <a href={`${item.link}`} data-rosey={generateRoseyId(item.text)}>
                          {!localeData ? item.text : localeData[`common:${generateRoseyId(item.text)}`]?.value}
                        </a>
                        <ul className="dropdown-menu">
                          {item.dropdown.map((dropdown_item, j) => (
                            <li key={j}>
                              <a
                                href={dropdown_item.dropdown_link}
                                data-rosey={generateRoseyId(dropdown_item.dropdown_text)}>
                                {!localeData ? dropdown_item.dropdown_text : localeData[`common:${generateRoseyId(dropdown_item.dropdown_text)}`]?.value}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                     <a href={`${item.link}`} data-rosey={generateRoseyId(item.text)}>
                     {!localeData ? item.text : localeData[`common:${generateRoseyId(item.text)}`]?.value}
                     </a>
                    )}
                  </li>
                ))}
                <li className="language-picker">
                  <button onClick={() => {setLangOpen(!isLangOpen)}}>
                    Lang
                  </button>
                  <ul className="lang-list" style={isLangOpen ? {display: "flex"} : {display: "none"}}>
                    {
                      navigation.locales.map((locale) => {
                        return (
                          <li key={locale.name}>
                            <a href={`/${locale.code}${pagePathname}`}> 
                              <img
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
                </li>
              </ul>
            </div>
            { navigation.enable_nav_btn ? (
               <div>
                  <div>
                     <a href={`${navigation.nav_btn?.link}`} data-rosey={generateRoseyId(navigation.nav_btn?.text)}>
                     {!localeData ? navigation.nav_btn?.text : localeData[`common:${generateRoseyId(navigation.nav_btn?.text)}`]?.value}
                     </a>
                  </div>
               </div>
            ) : null}
          </div>
        </nav>
      </header>
    </>
  );
}
```
