import { BrowserRouter } from "react-router-dom";
import HomeRoutes from "./PublicRoutes/HomeRoutes";
import DomainChecker from "./PrivateRoutes/DomainChecker";

export default function Routes() {
  return (
    <BrowserRouter>
      <DomainChecker>
        <HomeRoutes />
      </DomainChecker>
    </BrowserRouter>
  );
}