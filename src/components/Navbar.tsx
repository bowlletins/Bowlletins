'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Form } from 'react-bootstrap';
import { BoxArrowRight, Lock, Search } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  if (status === 'loading') return null;

  const currentUser = session?.user?.email;
  const role = session?.user?.role;

  return (
    <div>
      <div className="top-strip"></div>

      <Navbar className="nav-main d-flex align-items-center px-3 py-0" expand="xl">
        <Container fluid className="position-relative">

          {/* LOGO LEFT */}
          <Navbar.Brand href="/">
            <img src="/logo.png" width="160" alt="Bow-lletins" />
          </Navbar.Brand>

          {/* MENU BUTTON (MOBILE) */}
          <button
            className="menu-btn d-xl-none ms-auto"
            onClick={(e) => {
              const menu = document.getElementById('basic-navbar-nav');
              menu?.classList.toggle('show');

              const arrow = e.currentTarget.querySelector('.menu-arrow');
              arrow?.classList.toggle('open');
            }}
          >
            Menu <span className="menu-arrow">▾</span>
          </button>

          <Navbar.Collapse id="basic-navbar-nav">

            {/* DESKTOP CENTER NAV */}
            <Nav className="nav-center d-none d-xl-flex">
            {session ? (
  <Nav.Link
    href="/create-flyer"
    className="nav-link-custom"
    active={pathName === '/create-flyer'}
  >
    Create
  </Nav.Link>
) : (
  <Nav.Link href="/" className="nav-link-custom" active={pathName === '/'}>
  {/*Home*/}
  </Nav.Link>
)}

              <Nav.Link href="/explore" className="nav-link-custom" active={pathName === '/explore'}>
                Explore
              </Nav.Link>

              <NavDropdown title="Categories" className="nav-link-custom">
                <NavDropdown.Item href="/categories/Jobs">Jobs</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Internships">Internships</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Volunteer">Volunteer</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Events">Events</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Academics">Academics</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Social">Social</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Clubs_Organizations">Clubs &amp; Organizations</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="/about" className="nav-link-custom" active={pathName === '/about'}>
                About
              </Nav.Link>

              <Nav.Link href="/contact" className="nav-link-custom" active={pathName === '/contact'}>
                Contact
              </Nav.Link>
            </Nav>

            {/* MOBILE NAV */}
            <Nav className="nav-center d-flex d-xl-none">
            {session ? (
  <Nav.Link
    href="/create-flyer"
    className="nav-link-custom"
    active={pathName === '/create-flyer'}
  >
    Create
  </Nav.Link>
) : (
  <Nav.Link href="/" className="nav-link-custom" active={pathName === '/'}>
    {/*Home*/ }
  </Nav.Link>
)}

              <Nav.Link href="/explore" className="nav-link-custom">
                Explore
              </Nav.Link>

              <NavDropdown title="Categories" className="nav-link-custom">
                <NavDropdown.Item href="/categories/Jobs">Jobs</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Internships">Internships</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Volunteer">Volunteer</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Events">Events</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Academics">Academics</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Social">Social</NavDropdown.Item>
                <NavDropdown.Item href="/categories/Clubs_Organizations">Clubs &amp; Organizations</NavDropdown.Item>
              </NavDropdown>

              <Nav.Link href="/about" className="nav-link-custom">
                About
              </Nav.Link>

              <Nav.Link href="/contact" className="nav-link-custom">
                Contact
              </Nav.Link>

              {!session && (
                <>
                  <Nav.Link href="/#signin" className="nav-link-custom">
                    <Lock className="me-2" />
                    Login
                  </Nav.Link>

                  <Nav.Link href="/auth/signup" className="nav-link-custom">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>

            {/* SEARCH BAR (RIGHT SIDE) */}
            <Form className="nav-search-form ms-md-auto me-md-3 my-2 my-md-0" role="search">
              <div className="nav-search-wrap">
                <input
                  type="search"
                  className="nav-search-input"
                  placeholder="Search flyers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="nav-search-btn" aria-label="Search">
                  <Search />
                </button>
              </div>
            </Form>

            {/* RIGHT SIDE AUTH */}
            <Nav className="nav-auth mt-2 mt-md-0">
              {currentUser && role === 'ADMIN' && (
                <Nav.Link href="/admin">
                  Admin
                </Nav.Link>
              )}

{/* If user is logged in, show avatar and dropdown menu */}
              {session && (
                <NavDropdown
                 title={
                 <div className="nav-avatar">
               {session.user?.image ? (
                 <img
                  src={session.user.image}
                   alt="profile"
                   className="nav-avatar-img"
          />
                   ) : (
                <div className="nav-avatar-fallback">
                  {currentUser?.charAt(0).toUpperCase()}
              </div>
             )}
          </div>
       }
         align="end"
  >
<NavDropdown.Item href="/homeDashboard" className="nav-dropdown-item-custom">
  Dashboard
</NavDropdown.Item>

<NavDropdown.Item href="/profile" className="nav-dropdown-item-custom">
  <Lock className="me-2" />
  Settings
</NavDropdown.Item>

<NavDropdown.Item href="/api/auth/signout" className="nav-dropdown-item-custom">
  <BoxArrowRight className="me-2" />
  Sign Out
</NavDropdown.Item>

  </NavDropdown>
)}
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;