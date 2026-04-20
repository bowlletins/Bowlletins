'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();

  if (status === 'loading') return null;

  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  return (
    <div>
      <div className="top-strip"></div>

      <Navbar className="nav-main d-flex justify-content-between align-items-center px-4 py-2" expand="md">
        <Container>
          <Navbar.Brand href="/">
            <img src="/logo.png" width="200" alt="Bow-lletins" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto nav-center d-none d-md-flex">
              <Nav.Link href="/" className="nav-link-custom" active={pathName === '/'}>
                Home
              </Nav.Link>

              <Nav.Link
                href="/"
                className="nav-link-custom"
                active={pathName === '/posts'}
              >
                Posts
              </Nav.Link>

              <NavDropdown title="Categories" className="nav-link-custom">
                <NavDropdown.Item href="#">Jobs</NavDropdown.Item>
                <NavDropdown.Item href="#">Internships</NavDropdown.Item>
                <NavDropdown.Item href="#">Events</NavDropdown.Item>
                <NavDropdown.Item href="#">Study Groups</NavDropdown.Item>
                <NavDropdown.Item href="#">Social</NavDropdown.Item>
                <NavDropdown.Item href="#">Clubs</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="/about" className="nav-link-custom" active={pathName === '/about'}>
                About
              </Nav.Link>

              <Nav.Link href="#" className="nav-link-custom">
                Contact
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto align-items-center">

              {currentUser && role === 'ADMIN' && (
                <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'}>
                  Admin
                </Nav.Link>
              )}

              {session ? (
                <NavDropdown id="login-dropdown" title={currentUser}>
                  {session && (
                    <NavDropdown.Item id="login-dropdown-profile" href="/homeDashboard">
                      Profile
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                    <BoxArrowRight className="me-2" />
                    Sign Out
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="login-dropdown-change-password"
                    href="/auth/change-password"
                  >
                    <Lock className="me-2" />
                    Change Password
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div>
                  <a href="/signin" className="btn btn-sm text-uh-green me-2">
                    Login
                  </a>
                  <a href="/auth/signup" className="btn btn-sm btn-outline-success">
                    Sign Up
                  </a>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;