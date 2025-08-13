import PortfolioSection from "../../components/Portfoilo/PortfolioSection";
import { dummyPortfoilo } from "../../assets/dummyPortfolio";

function SavePortfolioDetailPage() {
  return (
    <div>
      <PortfolioSection {...dummyPortfoilo}></PortfolioSection>
    </div>
  );
}

export default SavePortfolioDetailPage;
