import { Container, Row, Col } from 'react-bootstrap';
import { Instagram, TwitterX, Facebook, Linkedin } from 'react-bootstrap-icons';

const Footer = () => (
  <footer className="footer-main bg-uh-green text-white">
    <Container fluid className="px-4">
      <Row className="align-items-center">

        {/* LEFT */}
        <Col md={4} className="d-flex align-items-center justify-content-start">
          <img src="/logo_white.png" className="footer-logo me-2" />
          <div className="footer-brand-text">
            <div>UH MĀNOA</div>
            <div>RAINBOW WARRIORS</div>
          </div>
        </Col>

        {/* CENTER */}
        <Col md={4} className="text-center">
          <div className="footer-links-row">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="footer-copy">
            © 2026 Bow-lletins
          </div>
        </Col>

        {/* RIGHT */}
        <Col md={4} className="d-flex justify-content-end footer-social">
          <a href="#"><Instagram /></a>
          <a href="#"><TwitterX /></a>
          <a href="#"><Facebook /></a>
          <a href="#"><Linkedin /></a>
        </Col>

      </Row>
    </Container>
  </footer>
);

export default Footer;
