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
    // Basic hex parsing support for both short/long patterns
    let hex = e.replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.slice(4, 6), 16) || 0;
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
      h: (h * 60).toFixed(2),
      s: (s * 100).toFixed(2),
      l: (l * 100).toFixed(2),
    };
    return hslResult;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let listOfColors: Color[] = JSON.parse(
      localStorage.getItem("colors") || "[]",
    );

    // Normalize hex format (must start with #)
    let finalHex = data.hex.toUpperCase();
    if (!finalHex.startsWith("#")) {
      finalHex = "#" + finalHex;
    }
    const normalizedData = {
      ...data,
      hex: finalHex,
    };

    props.setColor(normalizedData);
    listOfColors.push(normalizedData);
    localStorage.setItem("colors", JSON.stringify(listOfColors));

    setData({
      rgb: { r: "", g: "", b: "" },
      hex: "",
      hsl: { h: "", s: "", l: "" },
    });
    props.changeTrigger(true);
  };

  const hexTyping = (e: ChangeEvent<HTMLInputElement>) => {
    let hexVal = e.target.value;
    if (hexVal && !hexVal.startsWith("#")) {
      hexVal = "#" + hexVal;
    }
    setData((prev) => {
      return { ...prev, hex: hexVal };
    });
    // Check if valid hex (7 characters including #)
    if (hexVal.length === 7) {
      convertHexToRgb(hexVal);
    }
  };

  const handleChangeRgb = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Limit value to range 0-255
    let numVal = Number(value);
    if (numVal > 255) return;

    setData((prev) => {
      const newData = { ...prev.rgb, [name]: value };
      const newHex =
        "#" +
        convert(newData.r || "0") +
        convert(newData.g || "0") +
        convert(newData.b || "0");
      const newHsl = calcHsl(
        Number(newData.r || 0),
        Number(newData.g || 0),
        Number(newData.b || 0),
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
    const selectedHex = e.target.value.toUpperCase();
    setData((prev) => {
      return { ...prev, hex: selectedHex };
    });
    convertHexToRgb(selectedHex);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Add a New Color</h2>
        <p>
          Define custom values or pick a color visually using the palette widget
        </p>
      </div>

      <div className="form-grid">
        <div className="inputs-wrapper">
          <div className="container_hex">
            <h3>HEX Code</h3>
            <label htmlFor="value_hex">
              <span>Color Hex Code</span>
              <input
                type="text"
                id="value_hex"
                name="hex"
                placeholder="Ex. #6366F1"
                value={data.hex}
                onChange={hexTyping}
                maxLength={7}
                pattern="^#?[0-9A-Fa-f]{6}$"
                title="Invalid format. Please enter a valid hex color code, e.g., #0FADCC"
                required
              />
            </label>
          </div>

          <div className="container_rgb">
            <h3>RGB Channels</h3>
            <label htmlFor="color_r">
              <span>Red (R)</span>
              <input
                type="text"
                pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                id="color_r"
                name="r"
                value={data.rgb.r}
                onChange={handleChangeRgb}
                maxLength={3}
                title="Please enter a number between 0 and 255"
                required
                placeholder="0-255"
              />
            </label>
            <label htmlFor="color_g">
              <span>Green (G)</span>
              <input
                type="text"
                id="color_g"
                name="g"
                value={data.rgb.g}
                onChange={handleChangeRgb}
                pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                maxLength={3}
                title="Please enter a number between 0 and 255"
                required
                placeholder="0-255"
              />
            </label>
            <label htmlFor="color_b">
              <span>Blue (B)</span>
              <input
                type="text"
                id="color_b"
                name="b"
                value={data.rgb.b}
                onChange={handleChangeRgb}
                pattern="^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                maxLength={3}
                title="Please enter a number between 0 and 255"
                required
                placeholder="0-255"
              />
            </label>
          </div>
        </div>

        <div className="color-picker-widget">
          <div
            className="picker-preview-circle"
            style={{ backgroundColor: data.hex || "#000000" }}
          ></div>
          <div className="picker-label">
            {data.hex ? `${data.hex}` : "Visual Palette"}
            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginTop: "0.25rem",
              }}
            >
              Click circle to pick
            </span>
          </div>
          <input
            type="color"
            name="hex"
            id="color_rgb"
            value={data.hex || "#6366f1"}
            onChange={pipet}
          />
        </div>
      </div>

      <button type="submit">
        <svg
          style={{ width: "18px", height: "18px", fill: "currentColor" }}
          viewBox="0 0 24 24"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        Save Color
      </button>
    </form>
  );
}
