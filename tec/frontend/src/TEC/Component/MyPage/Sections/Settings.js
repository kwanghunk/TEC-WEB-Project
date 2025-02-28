import { Container } from "react-bootstrap";
import "../Styles/Settings.css";

const Settings = ({ setActiveTab }) => {

  return (
    <Container className="settings-container">
      <img src="/imgs/settings.png" alt="background" className="settings-bg-img" />
    </Container>
  )
}

export default Settings;