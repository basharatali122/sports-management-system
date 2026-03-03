import React, { useEffect } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import pageSvg from "../assets/svg/server_down.svg";

export default function NotFound() {
  const navigate = useNavigate();

  // Ensure sidebar classes don’t affect this page
  useEffect(() => {
    document.body.classList.remove("sidebar-show");
  }, []);

  const handleGoHome = () => navigate("/");

  return (
    <div className="page-error min-vh-100 d-flex flex-column bg-light text-center text-md-start">
      {/* Header */}
      <header className="py-3 border-bottom bg-white shadow-sm">
        <Container className="d-flex justify-content-between align-items-center">
          <Link to="/" className="fw-bold fs-4 text-decoration-none text-primary">
            UST
          </Link>
          <Nav className="gap-3">
            <Nav.Link href="#" aria-label="Twitter">
              <i className="ri-twitter-fill fs-5 text-dark"></i>
            </Nav.Link>
            <Nav.Link href="#" aria-label="GitHub">
              <i className="ri-github-fill fs-5 text-dark"></i>
            </Nav.Link>
            <Nav.Link href="#" aria-label="Dribbble">
              <i className="ri-dribbble-line fs-5 text-dark"></i>
            </Nav.Link>
          </Nav>
        </Container>
      </header>

      {/* Main Content */}
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <Row className="align-items-center gy-5">
          {/* Text Section */}
          <Col lg={6} className="order-2 order-lg-1 text-center text-lg-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="display-3 fw-bold text-primary mb-2">404</h1>
              <h2 className="fw-semibold mb-3">Page Not Found</h2>
              <p className="text-muted mb-4">
                Oops! The page you’re looking for doesn’t exist or has been moved.
                Please check the URL or return to the homepage.
              </p>
              <Button
                variant="primary"
                className="px-4 py-2 rounded-pill"
                onClick={handleGoHome}
              >
                Back to Dashboard
              </Button>
            </motion.div>
          </Col>

          {/* Illustration */}
          <Col lg={6} className="order-1 order-lg-2 text-center">
            <motion.img
              src={pageSvg}
              alt="404 Page Not Found illustration"
              className="img-fluid w-75 mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            />
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="py-3 border-top text-muted small">
        <Container className="text-center">
          © {new Date().getFullYear()} LIST — All rights reserved.
        </Container>
      </footer>
    </div>
  );
}
