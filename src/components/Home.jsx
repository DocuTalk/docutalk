import Hero from './Hero';
import Services from './Services';
import Pricing from './Pricing';
import Roadmap from './Roadmapp';

const Home = () => {
  return (
    <>
      <Hero />
      
      <div id="features" className="mt-[8rem]">
        <Services />
      </div>
      
      <div id="about" className="mt-[8rem]">
        <Pricing />
      </div>

      <div className="mt-[8rem]">
        <Roadmap />
      </div>
    </>
  );
};

export default Home; 