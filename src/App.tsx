import { useCallback, useEffect, useState } from "react";
import { FormAdd } from "./Components/FormAdd";
import Popup from "./Components/PopUp";
import TableColors from "./Components/TableColors";

export type Color = {
  hex: string;
  rgb: {
    r: string;
    g: string;
    b: string;
  };
  hsl: {
    h: string;
    s: string;
    l: string;
  };
};

function App() {
  const [adding, setAdding] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [color, setColor] = useState<Color>({
    hex: "",
    rgb: {
      r: "",
      g: "",
      b: "",
    },
    hsl: {
      h: "",
      s: "",
      l: "",
    },
  });
  const [listOfColors, setListOfColors] = useState<Color[]>([]);

  const sortList = useCallback((list: Color[]): Color[] => {
    return [...list].sort((a, b) => {
      if (a.rgb.r !== b.rgb.r) {
        return Number(b.rgb.r) - Number(a.rgb.r);
      }
      if (a.rgb.g !== b.rgb.g) {
        return Number(b.rgb.g) - Number(a.rgb.g);
      }
      if (a.rgb.b !== b.rgb.b) {
        return Number(b.rgb.b) - Number(a.rgb.b);
      }
      if (a.hsl.s !== b.hsl.s) {
        return Number(b.hsl.s) - Number(a.hsl.s);
      }
      return 0;
    });
  }, []);

  // Fetch and sort list when color list updates
  useEffect(() => {
    const listUnsorted = JSON.parse(localStorage.getItem("colors") || "[]");
    const listSorted = sortList(listUnsorted);
    setListOfColors(listSorted);
  }, [trigger, sortList]);

  // Handle addition success toast popup trigger
  useEffect(() => {
    if (trigger) {
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        setTrigger(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="App">
      <div className="displayInfo">
        <h1>Color Manager</h1>
        <button onClick={() => setAdding(!adding)}>
          {adding ? (
            <>
              <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Add New Color
            </>
          ) : (
            <>
              <svg style={{ width: "16px", height: "16px", fill: "currentColor" }} viewBox="0 0 24 24">
                <path d="M4 15h16v-2H4v2zm0 4h16v-2H4v2zm0-8h16V9H4v2zm0-6v2h16V5H4z" />
              </svg>
              View Saved Colors
            </>
          )}
        </button>
      </div>

      <div className="main">
        {adding ? (
          <TableColors list={listOfColors} setList={setListOfColors} />
        ) : (
          <FormAdd
            changeTrigger={setTrigger}
            setColor={setColor}
            color={color}
          />
        )}
      </div>

      <div className="toast-container">
        {showPopup && <Popup color={color} />}
      </div>
    </div>
  );
}

export default App;
