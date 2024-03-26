import HowItWorks from "../components/HowItWorks/HowItWorks";

interface IProps {}
const Home = ({}: IProps) => {
  return (
    <main>
      <header>
        <h1>Como funciona</h1>
      </header>
      <HowItWorks />
    </main>
  );
};

export default Home;
