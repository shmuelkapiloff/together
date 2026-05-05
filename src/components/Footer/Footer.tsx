
// function Footer() {
//   return (
//     <footer>
//       <div className="footer">Footer</div>
//     </footer>
//   )
// }

// export default Footer
import React from "react";
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>MyStore</h2>
          <p>The best place for electronic products.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@mystore.com</p>
          <p>Phone: 050-1234567</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} MyStore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;