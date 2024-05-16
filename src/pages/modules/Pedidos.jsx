import {
  Badge,
  Button,
  Card,
  Descriptions,
  Drawer,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { getPedidoId, getPedidosAdm } from "../../services/Pedidos.ws";
import { getCardapio } from "../../services/cardapio.ws";
import moment from "moment/moment";
import { io } from "socket.io-client";
import "../../css/Pedidos.css";
export default function Pedidos(atualizar) {
  const data = new Date();
  const hora = data.getHours();
  const dataFormatada =
    hora + ":" + data.getMinutes() + ":" + data.getSeconds();

  const [pedidos, setPedido] = useState([]);
  const [cardapio, setCardapio] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [pedidoss, setPedidos] = useState([]);
  const companySelectd = JSON.parse(localStorage.getItem("companySelectd"));
  const [open, setOpen] = useState(false);
  const [detalhesPedido, setDetalhesPedido] = useState({});
  const showDrawer = (pedido) => {
    setDetalhesPedido(pedido);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const openNotification = (placement, title, notifi) => {
    api.info({
      message: `${title}`,
      description: `${notifi}`,
      placement,
    });
  };

  useEffect(() => {
    getPedidoss();
    getPedido();
    const socket = io("http://192.168.12.11:3020"); // Substitua 'http://localhost:3000' pela URL correta do seu servidor

    socket.on("notification", (data) => {
      openNotification("topRight", data.title, data.notification);
      getPedido();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getPedido = async () => {
    const pedidos = await getPedidosAdm(companySelectd.idcompany);
    if (pedidos.length === 0) return message.error("Nenhum Pedido encontrado");
    setPedido(pedidos);
  };

  async function getPedidoss() {
    const pedidos = await getPedidoId(companySelectd.idcompany);
    setPedidos(pedidos);
  }

  useEffect(() => {
    getCardapios();
  }, []);

  const getCardapios = async () => {
    const cardapio = await getCardapio(
      companySelectd.idcompany,
      companySelectd.company
    );
    setCardapio(cardapio);
  };

  return (
    <div style={{ minHeight: "90vh" }}>
      <Drawer title="Detalhes do Pedido" onClose={onClose} open={open}>
        <div>
          <div>
            <strong>Hora do pedido:</strong>{" "}
            {moment(detalhesPedido.created_at).format("DD/MM/YYYY HH:mm:ss")}
          </div>

          <div>
            <strong>Status: </strong>
            <Badge
              status={
                detalhesPedido.status === "Em Analize"
                  ? "warning"
                  : detalhesPedido.status === "Cancelado"
                  ? "error"
                  : detalhesPedido.status === "Finalizado"
                  ? "success"
                  : detalhesPedido.status === "Em Preparo"
                  ? "processing"
                  : "default"
              }
              text={<text>{detalhesPedido.status}</text>}
            />
          </div>
          <div>
            <strong>Mesa:</strong> N° {detalhesPedido.mesa}
          </div>
          <div>
            <strong>Valor do Pedido:</strong> R$ {detalhesPedido.valor},00
          </div>
          <div>
            <strong>N° Pedido:</strong> {detalhesPedido.id}
          </div>
          <br />
          <div>
            <strong>Pedidos:</strong>
            {cardapio.length > 0 && pedidoss.length > 0 ? (
              pedidoss.map((pedidoss) => (
                <>
                  {detalhesPedido.pedidos === pedidoss.idpedido ? (
                    <>
                      {pedidoss.qdt > 0 ? (
                        <p>
                          x{pedidoss.qdt} {pedidoss.item}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                </>
              ))
            ) : (
              <p>Carregando...</p>
            )}
          </div>
          <br />
          {detalhesPedido.status === "Cancelado" ||
          detalhesPedido.status === "Em Cancelamento" ? (
            <>
              <p style={{ color: "red", fontWeight: "bold" }}>
                <strong>Motivo:</strong> {detalhesPedido.obs_cancel}
              </p>
            </>
          ) : null}
        </div>
      </Drawer>
      <h1>Atualizado as {dataFormatada}</h1>
      {contextHolder}

      {pedidos.map((pedido) => (
        <div style={{ marginBottom: 10 }}>
          <Card style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="cardTexte">
                <strong>Hora do pedido:</strong>{" "}
                {moment(pedido.created_at).format("DD/MM/YYYY HH:mm:ss")}
              </div>

              <div className="cardTexte">
                <strong>Status: </strong>
                <Badge
                  status={
                    pedido.status === "Em Analize"
                      ? "warning"
                      : pedido.status === "Cancelado"
                      ? "error"
                      : pedido.status === "Finalizado"
                      ? "success"
                      : pedido.status === "Em Preparo"
                      ? "processing"
                      : "default"
                  }
                  text={<text className="cardTexte">{pedido.status}</text>}
                />
              </div>
              <div className="cardTexte">
                <strong>Mesa:</strong> N° {pedido.mesa}
              </div>
              <div className="cardTexte">
                <strong>Valor do Pedido:</strong> R$ {pedido.valor},00
              </div>
              <div className="cardTexte">
                <strong>N° Pedido:</strong> {pedido.id}
              </div>
              <Button type="primary" onClick={() => showDrawer(pedido)}>
                Detalhes
              </Button>
            </div>

            {pedido.status === "Cancelado" ||
            pedido.status === "Em Cancelamento" ? (
              <>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  <strong>Motivo:</strong> {pedido.obs_cancel}
                </p>
              </>
            ) : null}
          </Card>
        </div>
      ))}
    </div>
  );
}
