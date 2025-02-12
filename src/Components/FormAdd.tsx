import React, { ChangeEvent, useState } from "react";
import { Color } from "../App";

export function FormAdd(props: {
  changeTrigger: Function;
  setColor: Function;
  color: Color;
}) {
  const [data, setData] = useState({
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

  const convert = (c: string) => {
    let result = Number(c).toString(16);
    return result.length === 1 ? "0" + result : result;
  };

  const convertHexToRgb = (e: string) => {
    const r = parseInt(e.slice(1, 3), 16);
    const g = parseInt(e.slice(3, 5), 16);
    const b = parseInt(e.slice(5, 7), 16);
    const hslCalc = calcHsl(r, g, b);
    setData((prev) => {
      return {
        ...prev,
        rgb: {
          r: r.toString(),
          g: g.toString(),
          b: b.toString(),
        },
        hsl: hslCalc,
      };
    });
  };

  const calcHsl = (red: number, green: number, blue: number) => {
    let [r, g, b] = [red / 255, green / 255, blue / 255];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0,
      s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
    }
    const hslResult = {
      h: (h * 360).toFixed(2),
      s: (s * 100).toFixed(2),
      l: (l * 100).toFixed(2),
    };
    return hslResult;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let listOfColors: Color[] = JSON.parse(localStorage.getItem("colors")!);
    props.setColor(data);
    listOfColors.push(data);
    localStorage.setItem("colors", JSON.stringify(listOfColors));
    setData({
      rgb: { r: "", g: "", b: "" },
      hex: "",
      hsl: { h: "", s: "", l: "" },
    });
    props.changeTrigger(true);
  };

  const hexTyping = (e: ChangeEvent<HTMLInputElement>) => {
    const hexVal = e.target.value;
    setData((prev) => {
      return { ...prev, hex: hexVal };
    });
    if (data.hex.length === 6) convertHexToRgb(hexVal);
  };

  const handleChangeRgb = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => {
      const newData = { ...prev.rgb, [name]: value.toUpperCase() };
      const newHex =
        "#" + convert(newData.r) + convert(newData.g) + convert(newData.b);
      const newHsl = calcHsl(
        Number(newData.r),
        Number(newData.g),
        Number(newData.b)
      );
      return {
        ...prev,
        hex: newHex.toUpperCase(),
        rgb: newData,
        hsl: newHsl,
      };
    });
  };

  const pipet = (e: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => {
      return { ...prev, hex: e.target.value.toUpperCase() };
    });
    convertHexToRgb(e.target.value.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container_rgb">
        <h1>RGB Values</h1>
        <label htmlFor="color_r">
          <p>Red</p>
          <input
            type="text"
            pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            id="color_r"
            name="r"
            value={data.rgb.r}
            onChange={(e) => handleChangeRgb(e)}
            maxLength={3}
            title="Please write number between: 0 - 255"
            required
            placeholder="Ex. 14"
          />
        </label>
        <label htmlFor="color_g">
          <p>Green</p>
          <input
            type="text"
            id="color_g"
            name="g"
            value={data.rgb.g}
            onChange={(e) => handleChangeRgb(e)}
            pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            maxLength={3}
            title="Please write number between: 0 - 255"
            required
            placeholder="Ex. 190"
          />
        </label>
        <label htmlFor="color_b">
          <p>Blue</p>
          <input
            type="text"
            id="color_b"
            name="b"
            value={data.rgb.b}
            onChange={(e) => handleChangeRgb(e)}
            pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
            maxLength={3}
            title="Please write number between: 0 - 255"
            required
            placeholder="Ex. 225"
          />
        </label>
      </div>
      <div className="container_hex">
        <label htmlFor="value_hex">
          <h1>HEX Value</h1>
          <input
            type="text"
            id="value_hex"
            name="hex"
            placeholder="Ex. #0FADCC"
            value={data.hex}
            onChange={(e) => hexTyping(e)}
            maxLength={7}
            pattern="#+[0-9,A-F,a-f]{6}"
            title="Invalid format ex. #000000 contain -> black"
            required
          />
        </label>
      </div>
      <input
        type="color"
        name="hex"
        id="color_rgb"
        value={data.hex}
        onChange={(e) => pipet(e)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
