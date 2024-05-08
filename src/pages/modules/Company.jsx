import { useEffect, useState } from "react";
import { getImgLogo } from "../../services/config";
import "../../css/Company.css";
import { Button, Input, Modal, Spin } from "antd";
import { PutEmpresa } from "../../services/user.ws";

export default function Company() {
  const companys = JSON.parse(localStorage.getItem("dateUser"));
  const [images, setImages] = useState({});
  const [acont, setAcont] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [pageModal, setPageModal] = useState(1);
  const [CompanyName, setCompanyName] = useState("");

  useEffect(() => {
    companys.user_profile_json.forEach(async (company) => {
      if (!company.idcompany) {
        console.error("Company not found");
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
      setShowModal(false);
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
                key={company.id}
                onClick={() =>
                  (window.location.href = "/dashboard/" + company.company)
                }
                className="company-card background-page"
              >
                {images[company.idcompany] ? (
                  <div className="company-image-container">
                    <img
                      src={atob(images[company.idcompany])}
                      alt="img"
                      className="company-image"
                    />
                  </div>
                ) : (
                  <div className="company-image-container">
                    <Spin />
                  </div>
                )}
                <h3 className="title-company">{company.company}</h3>
                <p className="title-company">{company.category}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="add-company">
              <div
                title="Adicionar Empresa"
                bordered={false}
                style={{ width: 300 }}
              >
                <p>Adicione uma nova ou mais empresas</p>
                <p>para acessar o painel de controle</p>
                <p>de cada uma delas</p>
                <Button
                  className="button-add-company"
                  type="primary"
                  onClick={() => setShowModal(true)}
                >
                  Adicionar Empresa
                </Button>
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
