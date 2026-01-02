function Footer() {
    const year = new Date().getFullYear();

    return (
      <footer className="footer" aria-label="Footer">
        <h3 className="footer-logo">RodriguezTech Studios</h3>

        <p>© RamTech LLC. All rights reserved {year} </p>

        <p>
          <small>
            Version 1.0.0 —{" "}
            <a
              href="https://github.com/RodriguezRamiro/DevsLanding"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </small>
        </p>
      </footer>
    );
  }

  export default Footer;
