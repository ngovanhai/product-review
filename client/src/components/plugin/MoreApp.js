import React from "react";
import moreAppConfig from "../../config/moreAppConfig";
// import "../css/more-app.css";

function shuffleArray(array) {
  let arrPush = [];
  for (let i = 0; i < 3; i++) {
    const j = array[Math.floor(Math.random() * array.length)];
    array = array.filter((item) => item !== j);
    arrPush.push(j);
  }
  return arrPush;
}

const MoreApp = () => {
  const shuffledPosts = shuffleArray(moreAppConfig.list);
  return (
    <div>
      <div className="footer-header ot_footer_star">
        Some other sweet <strong>Omega</strong> apps you might like!{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://apps.shopify.com/partners/omegaapps"
        >
          (View all app)
        </a>
      </div>
      <div className="omg-more-app">
        {shuffledPosts.map((post, idx) => {
          return (
            <div key={idx}>
              <p>
                <a
                  title={post.alt}
                  href={
                    post.href +
                    "?surface_detail=synctrack_paypal&&surface_type=Omega_Admin"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="imagePlugin" alt={post.alt} src={post.src} />
                </a>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MoreApp;
