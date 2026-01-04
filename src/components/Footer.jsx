function Footer() {
    const year = new Date().getFullYear();

    return (
      <footer className="footer" aria-label="Footer">
        <h3 className="footer-logo">RodriguezTech Studios</h3>
        <p>© 2023-{year} RamTech LLC. All rights reserved. </p>
      </footer>
    );
  }

  export default Footer;
