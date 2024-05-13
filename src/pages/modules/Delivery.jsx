import { useParams } from "react-router-dom";

const Delivery = () => {
  const { idcompay, Company } = useParams();

  return (
    <div>
      <h1>Delivery</h1>
      <h2>{Company}</h2>
    </div>
  );
};

export default Delivery;
