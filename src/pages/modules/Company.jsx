import { useEffect, useState } from "react";
import { getImgLogo } from "../../services/config";
import "../../css/Company.css";
import { Button, Input, Modal, Popconfirm, Select, Spin, message } from "antd";
import {
  PutEmpresa,
  admProfile,
  deleteCompany,
  getStyles,
} from "../../services/user.ws";
import { DeleteFilled, DeleteOutlined } from "@ant-design/icons";

export default function Company({ config }) {
  const companys = JSON.parse(localStorage.getItem("dateUser"));
  const [images, setImages] = useState({});
  const [acont, setAcont] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [CompanyName, setCompanyName] = useState("");
  const [modo, setModo] = useState(1);
  if (companys === null) {
    window.location.href = "/login/logout";
  }
  useEffect(() => {
    companys.user_profile_json.forEach(async (company) => {
      if (!company.idcompany) {
        setAcont(0);
      } else {
        const img = await getImgLogo(company.idcompany);
        setAcont(acont + 1);
        setImages((prevImages) => ({
          ...prevImages,
          [company.idcompany]: img[0]?.imagem,
        }));
      }
    });
  }, []);

  const addCompany = async () => {
    const data = {
      company: CompanyName,
      modo: modo,
    };
    const response = await PutEmpresa(data);
    if (response) {
      let body = {
        idcompany: response[0].id,
        id_user: companys.id,
        company: CompanyName,
        category: "ADM",
      };
      const resp = await admProfile(body);
      setShowModal(false);
      let body2 = [];
      resp.map((company) => {
        body2.push(...companys.user_profile_json, {
          id_user: company.id_user,
          id: company.id,
          company: company.company,
          category: company.category,
          idcompany: company.idcompany,
          Permission: company.Permission,
          modo: company.modo,
        });
      });

      const newDataUSer = {
        id: companys.id,
        name: companys.name,
        categoria: companys.categoria,
        active: companys.active,
        idcompany: companys.idcompany,
        user_profile_json: body2,
        company: companys.company,
        styles: companys.styles,
      };
      localStorage.setItem("dateUser", JSON.stringify(newDataUSer));
      window.location.reload();
    }
  };

  const getStyle = async (company) => {
    const Style = await getStyles(company.company, company.idcompany);
    localStorage.setItem("styles", JSON.stringify(Style[0]));
  };

  const CompanySelectd = async (company, imgLogo) => {
    localStorage.setItem("companySelectd", JSON.stringify(company));
    localStorage.setItem("companyLogo", JSON.stringify(imgLogo));
    localStorage.setItem(
      "CompanyLogoPNG",
      atob(JSON.parse(JSON.stringify(imgLogo)))
    );
    localStorage.setItem("LastPage", "1");
    await getStyle(company);
    if (company.active === false) {
      message.error("Usuário desativado");
    } else if (company.category === "ADM" || company.category === "Gerência") {
      window.location.href = "/dashboard/" + company.company;
    } else if (company.category === "Garçom") {
      window.location.href = "/Garçom/" + company.company;
    } else if (company.category === "Cozinha") {
      window.location.href = "/Cozinha/" + company.company;
    } else {
      message.error("Usuário não tem permissão", 5);
      setVisible(false);
    }
  };
  const modalDelete = (idcompany) => {
    Modal.warning({
      title: [
        <p>☠️Todos os dados dessa Empresa serão excluidos!!!☠️</p>,
        <p>Esse processo é irreversível!!!☠️</p>,
      ],

      footer: [
        <Button
          key="back"
          onClick={() => {
            Modal.destroyAll();
          }}
        >
          Cancelar
        </Button>,
        ,
        <Button
          key="submit"
          type="primary"
          style={{ marginLeft: 10 }}
          danger
          onClick={() => confirmDeleteImg(idcompany)}
        >
          ☠️Excluir☠️
        </Button>,
      ],
    });
  };

  const confirmDeleteImg = async (idcompany, index) => {
    await deleteCompany(idcompany);

    let body = [];
    companys.user_profile_json.map((company) => {
      if (company.idcompany !== idcompany) {
        body.push(company);
      }
    });
    const newDataUSer = {
      id: companys.id,
      name: companys.name,
      categoria: companys.categoria,
      active: companys.active,
      idcompany: companys.idcompany,
      user_profile_json: body,
      company: companys.company,
      styles: companys.styles,
    };
    localStorage.setItem("dateUser", JSON.stringify(newDataUSer));
    window.location.reload();
  };

  return (
    <div
      className="background-page control-painel "
      style={{ height: "100%", textAlign: "center" }}
    >
      <h1 style={{ marginTop: 0, padding: 21 }} className="title-company">
        Empresas
      </h1>
      <div>
        {acont > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 280px))",
              gap: "20px",
              padding: "15px",
              overflowX: "auto",
            }}
          >
            {companys?.user_profile_json.map((company, index) => (
              <div
                key={company?.id}
                onClick={() =>
                  !config
                    ? CompanySelectd(company, images[company?.idcompany])
                    : null
                }
                className="company-card background-page"
              >
                {images[company?.idcompany] ? (
                  <div className="company-image-container">
                    <img
                      src={atob(images[company?.idcompany])}
                      alt="img"
                      className="company-image"
                    />
                  </div>
                ) : (
                  <div className="company-image-container">
                    <Spin />
                  </div>
                )}
                {config && (
                  <Popconfirm
                    title="Tem certeza que deseja excluir essa imagem?"
                    okText="Excluir"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => modalDelete(company?.idcompany)}
                    cancelText="Cancelar"
                  >
                    <Button
                      style={{
                        backgroundColor: "#fc5f5f",
                        width: 20,
                        position: "absolute",
                        marginLeft: 218,
                        marginTop: -11,
                      }}
                    >
                      <DeleteOutlined
                        size={24}
                        style={{
                          color: "#fff",
                          marginLeft: -7,
                        }}
                      />
                    </Button>
                  </Popconfirm>
                )}

                <h3 className="title-company">{company?.company}</h3>
                <p className="title-company">{company?.category}</p>
              </div>
            ))}
            {(companys.categoria === "ADM" ||
              companys.categoria === "Gerência") & !config ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 22,
                }}
              >
                <div
                  className="company-card background-page"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div
                    title="Adicionar Empresa"
                    bordered={false}
                    style={{ width: 300 }}
                  >
                    <h1
                      className="button-add-company"
                      type="primary"
                      style={{ fontSize: 50 }}
                      onClick={() => setShowModal(true)}
                    >
                      +
                    </h1>
                    <p>Adicionar Empresa</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : companys.categoria === "ADM" ||
          companys.categoria === "Gerência" ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="add-company">
              <div
                title="Adicionar Empresa"
                bordered={false}
                style={{ width: 300 }}
              >
                <p>Adicione uma ou mais empresas</p>
                <p>para acessar o painel de controle</p>
                <p>de cada uma delas</p>
                <Button
                  className="button-add-company"
                  type="primary"
                  size="large"
                  onClick={() => setShowModal(true)}
                >
                  Adicionar Empresa
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="add-company">
              <div
                title="Você não tem empresas cadastradas"
                bordered={false}
                style={{ width: 300 }}
              >
                <h3>Você não tem empresas cadastradas</h3>
                <p>
                  Entre com contato com o Administrador da Empresa para
                  adiciona-lo em uma Empresa
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Modal
        title="Dados da empresa"
        open={showModal}
        onCancel={() => setShowModal(false)}
        okButtonProps={{ disabled: !CompanyName }}
        onOk={() => {
          addCompany();
        }}
        okText={"Adicionar"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p>Nome</p>
          <Input
            style={{ width: 200 }}
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              if (/[^a-zA-Z0-9 ]/g.test(value)) {
                message.error(
                  "Caracteres especiais e acentos não são permitidos."
                );
                return;
              }
              setCompanyName(value);
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <p>Tipo</p>

          <Select
            style={{ width: 200 }}
            defaultValue={1}
            onChange={(e) => setModo(e)}
          >
            <Select.Option value={1}>Cardapio</Select.Option>
            <Select.Option value={2}>Catálogo</Select.Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
}
