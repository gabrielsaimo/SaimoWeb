import React, { useState, useEffect } from "react";
import { Layout, Menu, Typography, Button, Drawer, Modal, Card } from "antd";
import Cookies from "js-cookie";
import { MenuOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.webp";
import logo_encanto_meio_do_mundo from "../../assets/encantomeiodomundo.webp";
import logo_encanto_amapaense from "../../assets/encantoamapaense.webp";
import "../../css/Home.css";
import Atropos from "atropos/react";
import "atropos/css";
const { Header, Footer, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Meta } = Card;
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

  const Comprar = (type) => {
    window.location.href = `/register/${type}`;
  };

  return (
    <Layout className="body">
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
              backgroundColor: "#1890ff00",
              paddingRight: 10,
              paddingTop: 10,
              textAlign: "center",
            }}
            onClick={showDrawer}
            icon={<MenuOutlined style={{ fontSize: 25 }} />}
          />
        </Menu>
        <Drawer
          title={<p className="title">Menu Digital</p>}
          placement="right"
          className="body"
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
              onClick={() => (window.location.href = "/Register")}
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
      <Content style={{ padding: "0 10px", marginTop: 164 }} className="">
        <div style={{ padding: 24, minHeight: 380 }}>
          <Title level={1} className="title">
            Bem-vindo ao Menu Digital
          </Title>
          <Paragraph className="paragraph">
            A Menu Digital é uma empresa líder em criação de cardápios digitais.
            Com uma equipe de especialistas altamente qualificados e uma paixão
            por inovação, oferecemos soluções modernas e inovadoras para ajudar
            nossos clientes a melhorar a experiência de seus clientes no
            restaurante. Nosso objetivo é tornar a experiência de jantar mais
            conveniente, agradável e eficiente para todos.
          </Paragraph>
          <Title level={2} className="title">
            Sistema de Delivery
          </Title>
          <Paragraph className="paragraph">
            Nosso sistema de delivery permite que seus clientes façam pedidos
            diretamente do conforto de suas casas. Com uma interface fácil de
            usar, opções de pagamento flexíveis e uma ampla seleção de pratos
            deliciosos, tornamos o processo de pedido tão simples quanto
            possível. Além disso, nosso sistema de entrega garante que os
            pedidos cheguem quentes e frescos, diretamente à porta do cliente.
          </Paragraph>
          <Title level={2} className="title">
            Sistema de Comandas
          </Title>
          <Paragraph className="paragraph">
            Nosso sistema de comandas digitaliza o processo de pedidos no
            restaurante. Com a capacidade de enviar pedidos diretamente para a
            cozinha e acompanhar o status do pedido em tempo real, você pode
            melhorar a eficiência do seu restaurante e a satisfação do cliente.
            Além disso, nosso sistema de comandas ajuda a reduzir erros de
            pedidos e melhora a comunicação entre a equipe de serviço e a
            cozinha.
          </Paragraph>
          <Title level={2} className="title">
            Sistema de Reservas
          </Title>
          <Paragraph className="paragraph">
            Nosso sistema de reservas permite que seus clientes reservem uma
            mesa no seu restaurante com facilidade. Com uma interface intuitiva
            e opções de reserva flexíveis, seus clientes podem reservar uma mesa
            com apenas alguns cliques. Além disso, nosso sistema de reservas
            ajuda a reduzir o tempo de espera e a melhorar a experiência do
            cliente no restaurante.
          </Paragraph>
          <Title level={2} className="title">
            Catálogo de Produtos
          </Title>
          <Paragraph className="paragraph">
            Nosso Carpádio Digital permite que você exiba seus pratos e bebidas
            de forma atraente e informativa. Com fotos de alta qualidade,
            descrições detalhadas e preços claros, seus clientes podem
            facilmente navegar pelo seu menu e fazer pedidos com confiança. Além
            disso, nosso catálogo de produtos é totalmente personalizável, para
            que você possa adicionar, remover ou editar itens conforme
            necessário.
          </Paragraph>
          <Title level={2} className="title">
            E Por Fim O Catálogo
          </Title>
          <Paragraph className="paragraph">
            Não Trabalhamos Apenas Com Cardápio Digital Também Trabalhamos Com
            Catálogo Digital Para Que Você Possa Exibir Seus Produtos De Forma
            Atraente E Informativa. Não Importa Se Você Tem Uma Loja De Roupas,
            Uma Loja De Eletrônicos Ou Uma Livraria, Nosso Catálogo Digital Pode
            Ajudá-lo A Atrair Mais Clientes E Aumentar As Vendas.
          </Paragraph>

          <Title level={2} className="title">
            Clientes Satisfeitos
          </Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              padding: "10px",
            }}
          >
            <Atropos
              activeOffset={100}
              shadowScale={1}
              shadowOffset={130}
              rotateX={130}
              rotateY={130}
              style={{ width: 351, margin: "10px" }}
            >
              <Card
                hoverable
                className="card-primary"
                style={{ padding: 2 }}
                cover={
                  <img
                    data-atropos-offset={"8"}
                    style={{ padding: "60px" }}
                    alt="example"
                    src={logo_encanto_amapaense}
                  />
                }
              >
                <Meta
                  title={
                    <h3 className="title" data-atropos-offset={"-2"}>
                      Encanto Amapaense
                    </h3>
                  }
                  data-atropos-offset={"-4"}
                  description={
                    <p className="title">
                      O Restaurante Encanto Amapaense viu um aumento de 30% nas
                      vendas após a implementação do Menu Digital.
                    </p>
                  }
                />
                <Button
                  data-atropos-offset={"6"}
                  style={{ marginTop: "20px" }}
                  type="primary"
                  href={`https://menu-digital.vercel.app/Cardapio/2/Encanto%20Amapaense`}
                >
                  Ver Cardapio
                </Button>
              </Card>
            </Atropos>
            <Atropos
              activeOffset={100}
              shadowScale={1}
              shadowOffset={130}
              rotateX={130}
              rotateY={130}
              style={{ width: 350, margin: "10px" }}
            >
              <Card
                hoverable
                className="card-primary"
                cover={
                  <img
                    data-atropos-offset={"8"}
                    style={{
                      padding: "50px",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                    alt="example"
                    src={logo_encanto_meio_do_mundo}
                  />
                }
              >
                <Meta
                  title={
                    <h3 className="title" data-atropos-offset={"-2"}>
                      Encanto meio do mundo
                    </h3>
                  }
                  data-atropos-offset={"-4"}
                  description={
                    <p className="title">
                      O Restaurante Encanto meio do mundo ja inalguou com o menu
                      digital e foi um sucesso!
                    </p>
                  }
                />
                <Button
                  data-atropos-offset={"6"}
                  style={{ marginTop: "20px" }}
                  type="primary"
                  href="https://menu-digital.vercel.app/Cardapio/2/Encanto%20Amapaense"
                >
                  Ver Cardapio
                </Button>
              </Card>
            </Atropos>
          </div>

          <Title level={2} className="title">
            Nossos Planos
          </Title>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              padding: "20px",
            }}
          >
            <Atropos
              activeOffset={100}
              shadowScale={1}
              shadowOffset={130}
              rotateX={130}
              rotateY={130}
              style={{ width: 240, margin: "10px" }}
            >
              <Card
                hoverable
                className="card"
                cover={
                  <img
                    data-atropos-offset={"8"}
                    style={{ padding: "20px" }}
                    alt="example"
                    src="https://consultoriaritz.com/wp-content/uploads/2021/07/prata.png"
                  />
                }
              >
                <Meta
                  title={
                    <div style={{ textAlign: "center" }}>
                      <h2 data-atropos-offset={"-2"} className="title">
                        Plano Mensal
                      </h2>
                      <h3 data-atropos-offset={"-2"} className="title">
                        R$80
                      </h3>
                      <h5 data-atropos-offset={"6"} className="title">
                        Anual (R$800)
                      </h5>
                    </div>
                  }
                  data-atropos-offset={"-4"}
                  description={
                    <p className="title">
                      Este é o nosso plano básico. Perfeito para pequenos
                      restaurantes que estão apenas começando a digitalizar seus
                      cardápios.
                    </p>
                  }
                />
                <Button
                  data-atropos-offset="6"
                  type="primary"
                  onClick={() => Comprar("Básico")}
                  style={{ marginTop: "20px" }}
                >
                  Comprar
                </Button>
              </Card>
            </Atropos>
            <Atropos
              activeOffset={100}
              shadowScale={1}
              shadowOffset={130}
              rotateX={130}
              rotateY={130}
              style={{ width: 240, margin: "10px" }}
            >
              <Card
                hoverable
                className="card"
                cover={
                  <img
                    data-atropos-offset={"8"}
                    style={{ padding: "20px" }}
                    alt="example"
                    src="https://consultoriaritz.com/wp-content/uploads/2021/07/ouro.png"
                  />
                }
              >
                <Meta
                  title={
                    <div style={{ textAlign: "center" }}>
                      <h2 data-atropos-offset={"-2"} className="title">
                        Plano Mensal
                      </h2>
                      <h3 data-atropos-offset={"-2"} className="title">
                        R$100
                      </h3>
                      <h5 data-atropos-offset={"6"} className="title">
                        Anual (R$999)
                      </h5>
                    </div>
                  }
                  data-atropos-offset={"-4"}
                  description={
                    <p className="title">
                      Este é o nosso plano intermediário. Ideal para
                      restaurantes de médio porte que precisam de mais recursos
                      e suporte personalizado.
                    </p>
                  }
                />
                <Button
                  data-atropos-offset={"6"}
                  type="primary"
                  onClick={() => Comprar("Intermediário")}
                  style={{ marginTop: "20px" }}
                >
                  Comprar
                </Button>
              </Card>
            </Atropos>
            <Atropos
              activeOffset={100}
              shadowScale={1}
              shadowOffset={130}
              rotateX={130}
              rotateY={130}
              style={{ width: 240, margin: "10px" }}
            >
              <Card
                hoverable
                className="card"
                cover={
                  <img
                    data-atropos-offset={"8"}
                    style={{ padding: "20px" }}
                    alt="example"
                    src="https://consultoriaritz.com/wp-content/uploads/2021/07/diamante.png"
                  />
                }
              >
                <Meta
                  title={
                    <div style={{ textAlign: "center" }}>
                      <h2 data-atropos-offset={"-2"} className="title">
                        Plano Mensal
                      </h2>
                      <h3 data-atropos-offset={"-2"} className="title">
                        R$120
                      </h3>
                      <h5 data-atropos-offset={"6"} className="title">
                        Anual (R$1.200)
                      </h5>
                    </div>
                  }
                  data-atropos-offset={"-4"}
                  description={
                    <p className="title">
                      Este é o nosso plano premium. Perfeito para grandes
                      restaurantes que precisam de todos os nossos recursos e
                      suporte prioritário.
                    </p>
                  }
                />
                <Button
                  data-atropos-offset={"6"}
                  onClick={() => Comprar("Premium")}
                  type="primary"
                  style={{ marginTop: "20px" }}
                >
                  Comprar
                </Button>
              </Card>
            </Atropos>
          </div>
        </div>
      </Content>
      <Footer className="body" style={{ textAlign: "center" }}>
        <p className="title">
          © {new Date().getFullYear()} Menu Digital. Todos os direitos
          reservados.
        </p>
      </Footer>
    </Layout>
  );
};

export default Home;
