
export const Footer = () => {
  return (
    <footer className="footer">
      <div className="row">
        <div className="col-1-2">
          <div className="footer__navigation">
            <ul className="footer__list">
              <li className="footer__item"><a href="/" className="footer__link">Company</a></li>
              <li className="footer__item"><a href="/" className="footer__link">Contact us</a></li>
              <li className="footer__item"><a href="/" className="footer__link">Carrers</a></li>
              <li className="footer__item"><a href="/" className="footer__link">Privacy policy</a></li>
              <li className="footer__item"><a href="/" className="footer__link">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="col-1-2">
          <p className="footer__copyright">
            Built by <a href="/" className="footer__link">Karla Duran</a> for Jonas Schmedtmann online course <a href="/" className="footer__link">Advanced CSS and Sass</a>. Copyright &copy; by Karla Duran. You are 100% allowed to use this webpage for both personal and commercial use, but NOT to claim it as your own design. A credit to the original author, Jonas Schmedtmann, is of course highly appreciated!
          </p>
        </div>
      </div>
    </footer>
  )
}
