import React from "react";
import { useEffect, useState } from "react";
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

  const sortList = (list: Color[]): Color[] => {
    return list.sort((a, b) => {
      // First check red
      if (a.rgb.r !== b.rgb.r) {
        return Number(b.rgb.r) - Number(a.rgb.r);
      }
      // Then check green
      if (a.rgb.g !== b.rgb.g) {
        return Number(b.rgb.g) - Number(b.rgb.g);
      }
      // Then check blue
      if (a.rgb.b !== b.rgb.b) {
        return Number(b.rgb.b) - Number(a.rgb.b);
      }
      // Then check saturation
      if (a.hsl.s !== b.hsl.s) {
        return Number(b.hsl.s) - Number(a.hsl.s);
      }
      // If everything is equal then don't do anything
      return 0;
    });
  };

  useEffect(() => {
    if (localStorage.getItem("colors") === null) {
      localStorage.setItem("colors", JSON.stringify([]));
    } else {
      const listUnsorted = JSON.parse(localStorage.getItem("colors")!);
      const listSorted = sortList(listUnsorted);
      setListOfColors(listSorted);
    }
  }, [trigger]);

  const showPop = () => {
    return trigger
      ? setTimeout(() => {
          setTrigger(!trigger);
        }, 2000)
      : "";
  };
  return (
    <div className="App">
      <div className="displayInfo">
        <h1>Welcome</h1>
        <h3>{}</h3>
        <button onClick={() => setAdding(!adding)}>
          {adding ? "Adding new color" : "See all colors"}
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
        {showPop() ? <Popup color={color} /> : ""}
      </div>
    </div>
  );
}

export default App;
