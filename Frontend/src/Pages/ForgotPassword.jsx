import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import pageSvg from "../assets/svg/forgot_password.svg";

export default function ForgotPassword() {

  return (
    <div className="page-auth">
      <div className="header">
        <Container>
          <Link to="/" className="header-logo">
            Digital Arena
          </Link>
        </Container>
      </div>

      <div className="content">
        <Container>
          <Card className="card-auth">
            <Card.Body className="text-center">
              <div className="mb-5">
                <object
                  type="image/svg+xml"
                  data={pageSvg}
                  className="w-75"
                  aria-label="svg image"></object>
              </div>
              <Card.Title>Reset your password</Card.Title>
              <Card.Text className="mb-5">
                This is a simple process to reset your password. <em>Don't worry!</em>
               <br /> <i className="text-red-700 font-extrabold underline text-xl">Under development</i>
              </Card.Text>


              <Row className="mt-4 d-flex justify-content-center">
                <Col sm="4">
                  <Button variant="primary" href="/login">
                    Sign In
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
  );
}
