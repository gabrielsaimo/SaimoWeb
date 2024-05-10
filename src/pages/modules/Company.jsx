import { useEffect, useState } from "react";
import { getImgLogo } from "../../services/config";
import "../../css/Company.css";
import { Button, Input, Modal, Spin } from "antd";
import { PutEmpresa, admProfile } from "../../services/user.ws";

export default function Company() {
  const companys = JSON.parse(localStorage.getItem("dateUser"));
  const [images, setImages] = useState({});
  const [acont, setAcont] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [CompanyName, setCompanyName] = useState("");
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
          company: company.company,
          id_user: company.id_user,
          id: company.id,
          idcompany: company.idcompany,
          category: company.category,
          Permission: company.Permission,
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

  const CompanySelectd = (company, imgLogo) => {
    localStorage.setItem("companySelectd", JSON.stringify(company));
    localStorage.setItem("companyLogo", JSON.stringify(imgLogo));
    window.location.href = "/dashboard/" + company.company;
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
            {companys?.user_profile_json.map((company) => (
              <div
                key={company?.id}
                onClick={() => CompanySelectd(company)}
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
                <h3 className="title-company">{company?.company}</h3>
                <p className="title-company">{company?.category}</p>
              </div>
            ))}
            {companys.categoria === "ADM" ||
            companys.categoria === "Gerência" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
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
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <p>Nome</p>
          <Input
            style={{ width: 200 }}
            type="text"
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
