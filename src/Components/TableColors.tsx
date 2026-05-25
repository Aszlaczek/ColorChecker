import React, { useCallback, useEffect, useState } from "react";
import { Color } from "../App";
import PopUpInfo from "./PopUpInfo";
import "../Styles/table.scss";

export type Conditions = {
  red: boolean;
  green: boolean;
  blue: boolean;
  saturation: boolean;
};

export default function TableColors(props: {
  list: Color[];
  setList: Function;
}) {
  const [list, setList] = useState(props.list);
  const [filter, setFilter] = useState<Conditions>({
    red: false,
    green: false,
    blue: false,
    saturation: false,
  });

  const [show, setShow] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleFilterChange = (color: string): void => {
    setFilter((prev) => {
      return { ...prev, [color]: !prev[color as keyof Conditions] };
    });
  };

  const applyFilters = useCallback((filterState: Conditions, sourceList?: Color[]): void => {
    let newFilterList = [...props.list];

    if (sourceList !== undefined && sourceList !== null) {
      newFilterList = sourceList;
    }

    if (filterState.red) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.r) > 127);
    }

    if (filterState.green) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.g) > 127);
    }

    if (filterState.blue) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.b) > 127);
    }

    if (filterState.saturation) {
      newFilterList = newFilterList.filter((e) => Number(e.hsl.s) > 50);
    }
    setList(newFilterList);
  }, [props.list]);

  const handleDelete = (item: string): void => {
    let newList = props.list.filter((e) => item !== e.hex);
    setList(newList);
    props.setList(newList);
    localStorage.setItem("colors", JSON.stringify(newList));
    applyFilters(filter, newList);
    showPopUp();
  };

  const showPopUp = (): void => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  useEffect(() => {
    applyFilters(filter);
  }, [filter, applyFilters]);

  // Sync internal list with props.list if it changes outside
  useEffect(() => {
    applyFilters(filter, props.list);
  }, [props.list, filter, applyFilters]);

  return (
    <>
      <div className="table-controls-wrapper">
        <div className="filter-controls">
          <span className="filter-label">Filter Channels:</span>
          <div className="filter-group">
            <button
              className={`red ${filter.red ? "active" : ""}`}
              onClick={() => handleFilterChange("red")}
            >
              Red &gt; 127
            </button>
            <button
              className={`green ${filter.green ? "active" : ""}`}
              onClick={() => handleFilterChange("green")}
            >
              Green &gt; 127
            </button>
            <button
              className={`blue ${filter.blue ? "active" : ""}`}
              onClick={() => handleFilterChange("blue")}
            >
              Blue &gt; 127
            </button>
            <button
              className={`saturation ${filter.saturation ? "active" : ""}`}
              onClick={() => handleFilterChange("saturation")}
            >
              Sat &gt; 50%
            </button>
          </div>
        </div>

        <div className="view-mode-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 11h5V5H4v6zm0 8h5v-6H4v6zm6 0h5v-6h-5v6zm6 0h5v-6h-5v6zm-6-8h5V5h-5v6zm6-6v6h5V5h-5z" />
            </svg>
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            <svg viewBox="0 0 24 24">
              <path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z" />
            </svg>
            List
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>No Colors Found</h3>
          <p>Try clearing active filters or add a new custom color to your palette.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="color-grid">
          {list.map((e, id) => (
            <div className="color-card" key={id}>
              <div
                className="delete-card-btn"
                title="Delete color"
                onClick={() => handleDelete(e.hex)}
              >
                ✕
              </div>
              <div
                className="card-color-header"
                style={{ backgroundColor: e.hex }}
                onClick={() => copyToClipboard(e.hex)}
              >
                <div className="copy-overlay">CLICK TO COPY</div>
              </div>
              <div className="card-body">
                <h4 className="hex-title" onClick={() => copyToClipboard(e.hex)}>
                  {e.hex}
                </h4>
                <div className="channels-grid">
                  <div className="channel-box red-channel">
                    <span>R</span>
                    <span>{e.rgb.r}</span>
                  </div>
                  <div className="channel-box green-channel">
                    <span>G</span>
                    <span>{e.rgb.g}</span>
                  </div>
                  <div className="channel-box blue-channel">
                    <span>B</span>
                    <span>{e.rgb.b}</span>
                  </div>
                </div>
                <div className="card-footer">
                  <span>HSL: {Math.round(Number(e.hsl.h))}°</span>
                  <span className="sat-value">Sat: {Math.round(Number(e.hsl.s))}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Color Swatch</th>
                <th>Red</th>
                <th>Green</th>
                <th>Blue</th>
                <th>Saturation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, id) => {
                return (
                  <tr key={id}>
                    <td>
                      <div
                        className="color-preview-bar"
                        onClick={() => copyToClipboard(e.hex)}
                      >
                        <div
                          className="color-preview-swatch"
                          style={{ backgroundColor: e.hex }}
                        ></div>
                        <span>{e.hex}</span>
                      </div>
                    </td>
                    <td className="channel-cell" style={{ color: "var(--danger)" }}>
                      {e.rgb.r}
                    </td>
                    <td className="channel-cell" style={{ color: "var(--success)" }}>
                      {e.rgb.g}
                    </td>
                    <td className="channel-cell" style={{ color: "var(--primary)" }}>
                      {e.rgb.b}
                    </td>
                    <td className="channel-cell" style={{ color: "#f59e0b" }}>
                      {e.hsl.s}%
                    </td>
                    <td>
                      <button
                        className="table-delete-btn"
                        onClick={() => handleDelete(e.hex)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Elegant notifications container */}
      <div className="toast-container">
        {show && <PopUpInfo />}
        {copiedText && (
          <div className="popup" style={{ borderLeftColor: "var(--primary)" }}>
            <h1>Copied!</h1>
            <span>Hex code copied to clipboard</span>
            <div className="toast-color-badge">
              <span
                className="badge-dot"
                style={{ backgroundColor: copiedText }}
              ></span>
              <span>{copiedText}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
