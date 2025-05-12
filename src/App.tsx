import { toast, ToastContainer } from 'react-toastify';
import { Button } from './components/ui/button';

function App() {
  return (
    <>
      <div className="flex justify-between items-center h-screen">
        <p className=" text-xl p-30 font-extralight">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet beatae
          expedita molestiae ullam minus ipsa officia accusantium! Commodi
          facere blanditiis harum tempora, officiis cumque nobis provident
          libero nemo iure aliquam? Maiores eos rerum provident, quod magnam qui
          praesentium ipsum, temporibus dolorem saepe ullam reprehenderit
          necessitatibus ipsam laboriosam ducimus consectetur quasi error
          tempora quae sint, accusamus hic dolores ipsa. Quaerat, corrupti!
          Doloremque perspiciatis aperiam maxime aliquam quae. Cumque, odit.
          Veritatis, laudantium inventore quam nihil dolore iure? Nesciunt
          aspernatur beatae inventore molestias consequatur tempora dolor odit
          error quas! Magni fugiat illum similique.
        </p>
        <p className="m-30 text-xl jetBrains-text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod,
          adipisci unde voluptates velit esse ea modi, perspiciatis dolores
          numquam necessitatibus vero eveniet recusandae quibusdam atque rem
          dolore. Fuga, vero blanditiis? Odio, explicabo nihil porro voluptatem
          deleniti ullam id sunt incidunt, provident consectetur atque veritatis
          molestiae! Tempora odio nesciunt totam excepturi odit praesentium ab,
          amet debitis mollitia impedit, suscipit aspernatur ipsam. Aut
          accusamus sunt illo optio hic earum accusantium distinctio, inventore
          sapiente maxime molestias ex eos. Accusamus iste, maiores odit tenetur
          aut sapiente, reiciendis esse illo assumenda id temporibus tempora
          qui?
        </p>
        <Button onClick={() => toast.success('too easy!')}>
          toast the msg
        </Button>
        <ToastContainer
          position="top-center"
          toastStyle={{
            backgroundColor: 'var(--background)',
          }}
        />
      </div>
    </>
  );
}

export default App;
