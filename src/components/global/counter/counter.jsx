import MarkdownIt from "markdown-it";
import { generateRoseyId } from "rosey-connector/helpers/text-formatters.mjs"
const md = new MarkdownIt({ html: true });

export default function GlobalCounter(block) {
  return (
    <section
      className={`counter-up ${
        block.alternate_style ? "counter-up-two pb-xxl-14 pb-lg-13" : ""
      }`}
      id="counter-up"
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-header">
              <h2>
                <span data-rosey={generateRoseyId(block.title)}>{block.title}</span>
                <span data-rosey={generateRoseyId(block.title_suffix)}>{block.title_suffix}</span>
              </h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(block.description),
                }}
                data-rosey-ns="rcc-markdown"
                data-rosey-tagger
              />
            </div>
          </div>
          <div className="col-12">
            <div className="counter-up-wrapper d-grid">
              {block.numbers.map((number, i) => (
                <div className="counter-up-content" key={i}>
                  <div className="counter-up-content-item">
                    <div className="counter-percent">
                      {number.prefix && (
                        <span className="percent">{number.prefix}</span>
                      )}

                      <span className="counter">{number.number}</span>

                      {number.suffix && (
                        <span className="percent">{number.suffix}</span>
                      )}
                    </div>
                    <p data-rosey={generateRoseyId(number.text)}>{number.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
