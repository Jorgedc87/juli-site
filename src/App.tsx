import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { firebaseConfig } from './firebaseConfig';
import { Fireworks } from '@fireworks-js/react';
// import { Engine } from "@tsparticles/engine";
// import { loadFull } from "tsparticles";
import Particles from '@tsparticles/react';

// Firebase configuration
initializeApp(firebaseConfig);

export const App = () => {
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFireworks, setShowFireworks] = useState(false); // Estado para controlar los fuegos artificiales
  const db = getDatabase();

  useEffect(() => {
    const dbRef = ref(db);
    get(child(dbRef, `switchState`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setIsOn(snapshot.val());
        }
      })
      .finally(() => {
        setLoading(false);  // Cuando los datos se han cargado, desactiva el loading
      });
  }, [db]);

  const toggleSwitch = () => {
    const newState = !isOn;
    setIsOn(newState);
    set(ref(db, 'switchState'), newState);

    if (newState) {
      setShowFireworks(true);
      setTimeout(() => {
        setShowFireworks(false); 
      }, 5000);
    }
  };

  // const particlesInit = async (engine: Engine) => {
  //   await loadFull(engine);
  // };

  if (loading) {
    return (
      <div className="h-screen bg-slate-600 flex flex-col justify-center items-centerr">
        <header className={`w-full h-[200px] fixed top-0 flex justify-center items-center p-4 text-center transition-all duration-500 bg-[#497fb1]`}>
        <h1 className="text-5xl font-nunito text-white">
          Cargando estado de la relación...
        </h1>
      </header>
        
      </div>
    );
  }

  return (
    <div className={`h-screen bg-slate-600 flex flex-col justify-center items-center ${isOn ? 'bg-green-50' : 'bg-red-50'}`}>
      <header className={`w-full h-[200px] fixed top-0 flex justify-center items-center p-4 text-center transition-all duration-500 ${isOn ? 'bg-[#89b17a] text-white' : 'bg-red-500 text-white'}`}>
        <h1 className="text-5xl font-nunito">
          {isOn ? 'Julieta está de novia 💚' : 'Julieta está peleada con el novio 💔'}
        </h1>
      </header>

      <div className="flex items-center space-x-4 mt-8">
        <span className="text-2xl font-bold text-[#ff6e6e]">No</span>
        
        <div
          className={`relative w-24 h-12 p-1 rounded-full cursor-pointer transition-all duration-500 ${isOn ? 'bg-green-500' : 'bg-red-500'}`}
          onClick={toggleSwitch}
        >
          <div
            className={`absolute w-10 h-10 bg-white rounded-full shadow-md transform transition-transform duration-500 ${isOn ? 'translate-x-12' : 'translate-x-0'}`}
          />
        </div>

        <span className="text-2xl font-bold text-[#50eb93]">Sí</span>
      </div>

      {showFireworks && (
        <Fireworks options={{ acceleration: 1, friction: 0.95 }} style={{ position: 'fixed', width: '100%', height: '100%' }} />
      )}

      {!isOn && (
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: true },
            particles: {
              number: { value: 50 },
              shape: { type: 'image', options: { image: { src: "https://cdn0.iconfinder.com/data/icons/remoji-soft-1/512/emoji-crying.png" }}} ,
              move: { enable: true, speed: 2 },
              size: { value: 30 },
              opacity: { value: 1 },
            }
          }}
        />
      )}
    </div>
  );
};
