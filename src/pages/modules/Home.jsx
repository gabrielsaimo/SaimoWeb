import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Drawer, Modal } from "antd";
import Cookies from "js-cookie";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";
const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("acceptsCookies");
    if (!cookie) {
      setModal(true);
    }
  }, []);

  const handleOk = () => {
    Cookies.set("acceptsCookies", "true");
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ position: "fixed", zIndex: 1, width: "100%", height: 80 }}
      >
        <div style={{ float: "left" }}>
          <Link to="/">
            <img
              src={logo}
              style={{ borderRadius: "100%", margin: "5px 30px 5px 10px" }}
              alt="Menu Digital"
              height="64"
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ margin: 5 }}
        >
          <Menu.Item
            key="1"
            style={{
              borderRadius: 5,
              position: "absolute",
              right: 10,
              top: 5,
              width: 80,
              paddingRight: 10,
              paddingTop: 10,
              textAlign: "center",
            }}
            onClick={showDrawer}
            icon={<MenuOutlined style={{ fontSize: 25 }} />}
          />
        </Menu>
        <Drawer
          title="Menu Digital"
          placement="right"
          closable={false}
          onClose={onClose}
          open={visible}
          extra={
            <Button type="dashed" onClick={onClose}>
              X
            </Button>
          }
        >
          <div>
            <Button
              type="primary"
              style={{ marginRight: "10px", width: 150, marginBottom: 20 }}
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </Button>
          </div>
          <div>
            <Button
              type="primary"
              style={{ marginRight: "10px", width: 150, marginBottom: 20 }}
              onClick={() => (window.location.href = "/register")}
            >
              Registrar
            </Button>
          </div>
        </Drawer>
      </Header>
      <Modal
        title="Política de Privacidade"
        open={modal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Aceitar"
        cancelText="Recusar"
      >
        <p>Aceita os nossos termos e condições?</p>
        <Button type="link" href="/privacy-policy">
          Ver Política de Privacidade
        </Button>
      </Modal>
      <Content style={{ padding: "0 0px", marginTop: 164 }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <Title>Bem-vindo ao Menu Digital</Title>
          <Paragraph>
            A Menu Digital é uma empresa líder em desenvolvimento de sites e
            aplicativos. Com uma equipe de especialistas altamente qualificados,
            oferecemos soluções modernas e inovadoras para ajudar nossos
            clientes a alcançar seus objetivos de negócios.
          </Paragraph>
          <Title level={2}>Tecnologias de Programação</Title>
          <Paragraph>
            Utilizamos as mais recentes tecnologias de programação para garantir
            que nossos produtos sejam de alta qualidade e estejam à frente da
            curva. Nossas tecnologias incluem React, Node.js, Python, Java e
            muito mais.
          </Paragraph>
          <Title level={2}>Soluções Modernas</Title>
          <Paragraph>
            Entendemos que o mundo da tecnologia está sempre mudando. É por isso
            que nos esforçamos para fornecer soluções modernas que sejam
            relevantes no mercado atual. Seja através do uso de inteligência
            artificial, aprendizado de máquina ou desenvolvimento de aplicativos
            móveis, estamos sempre buscando maneiras de inovar e melhorar.
          </Paragraph>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} Menu Digital. Todos os direitos reservados.
      </Footer>
    </Layout>
  );
};

export default Home;
