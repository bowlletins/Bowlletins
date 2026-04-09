import { Major } from '@prisma/client';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';
import {Container, Row, Col, Nav, Image} from 'react-bootstrap';

type SessionUser = {
  email: string;
  id: string;
  fullName: string;
  major: Major;
  image: string;
};

export default async function BoardPage() {

  const session = await auth();

  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );

  const user = session?.user as SessionUser;


  return (
    <Container fluid className="dashboard-layout-bg">
      <Row>
        <Col md={3} lg={2} className="sidebar-column">
          <SidebarContent user={user} />
        </Col>
        <Col md={9} lg={10} className="main-column">
          <MainFeed user={user} />
        </Col>
      </Row>
    </Container>
  );
}

const SidebarContent: React.FC<{ user: SessionUser }> = ({ user }) => {
  return (
    <div className="py-4 px-3 d-flex flex-column h-100">
      {/* Profile Section */}
      <div className="text-center mb-5">
        <Image 
          src="https://via.placeholder.com/120" 
          rounded 
          className="profile-avatar mb-3 shadow-sm" 
        />
        <h5 className="fw-bold m-0">{user.fullName}e</h5>
        <p className="text-muted small">{user.major}</p>
      </div>

      {/* Navigation */}
      <Nav variant = "tabs" className="flex-column nav-pills custom-nav">
        <Nav.Item className="nav-item">
            <Nav.Link href="#">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#" className="nav-item active">Saved Posts</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#" className="nav-item">Recently Viewed</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#">Messages</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#">Settings</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

const MainFeed: React.FC<{ user: SessionUser }> = ({ user }) => {
  const firstName = user.fullName.split(' ')[0]??'User';
  return (
    <div className="p-5">
      <h1 className="welcome-heading mb-5">Welcome back, {firstName}</h1>
      
      <section>
        <h3 className="section-subtitle mb-4">Saved Posts</h3>
        
        {/* Paper Item 1 */}
        <div className="post-card d-flex align-items-center p-3 mb-3 shadow-sm">
          <div className="post-icon me-3">📔</div>
          <div className="flex-grow-1">
            <h6 className="fw-bold mb-0">Part-Time Library Assistant</h6>
            <small className="text-muted">Hamilton Library • 2 hrs ago</small>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" />
          </div>
        </div>
      </section>
    </div>
  );
};      
