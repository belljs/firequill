import { useState } from "react";
import Header from "./components/Header.jsx";
import Editor from "./components/Editor.jsx";
import Footer from "./components/Footer.jsx";
import Modal from "./components/Modal.jsx";

export default function App() {
  const [openModal, setOpenModal] = useState(null); // "settings" | "info" | null
  const handleCloseModal = () => setOpenModal(null);


  return (
    <div className="app">
      <Header
        onSettingsClick={() => setOpenModal("settings")}
        onInfoClick={() => setOpenModal("info")}
      />
      <Editor />
      <Footer />

      {openModal && (
        <Modal
          title={openModal === "settings" ? "Settings" : "About Firequill"}
          onClose={handleCloseModal}
        >
          {openModal === "settings" ? (
            <>
              <p>This is a placeholder button. In the future, users will be able to adjust settings such as the color theme here.</p>
            </>
          ) : (
            <>
              <p>
                Firequill is a small, syntax-highlighted note editor that runs
                entirely in your browser. There are no accounts, no databases,
                and no servers.
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}