import React, { useEffect, useState } from "react";
import { Color } from "../App";
import PopUpInfo from "./PopUpInfo";
import "../Styles/table.scss";
import ShowFilterInfo from "./ShowFilterInfo";
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
  // Function to toggle filters and update filter state
  const handleFilterChange = (color: string): void => {
    setFilter((prev) => {
      return { ...prev, [color]: !prev[color as keyof Conditions] };
    });
  };
  const applyFilters = (list?: Color[]): void => {
    let newFilterList = [...props.list];

    if (list !== undefined && list !== null) {
      newFilterList = list;
    }

    // Apply the red filter if it's selected
    if (filter.red) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.r) > 127);
    }

    // Apply the green filter if it's selected
    if (filter.green) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.g) > 127);
    }

    // Apply the blue filter if it's selected
    if (filter.blue) {
      newFilterList = newFilterList.filter((e) => Number(e.rgb.b) > 127);
    }

    // Apply the saturation filter if it's selected
    if (filter.saturation) {
      newFilterList = newFilterList.filter((e) => Number(e.hsl.s) > 50);
    }
    setList(newFilterList);
  };

  const handleDelete = (item: string): void => {
    let newList = props.list.filter((e) => item !== e.hex);
    setList(newList);
    props.setList(newList);
    localStorage.setItem("colors", JSON.stringify(newList));
    applyFilters(newList);
    showPopUp();
  };

  const showPopUp = (): void => {
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  useEffect(() => {
    applyFilters();
  }, [filter]);

  return (
    <>
      <ShowFilterInfo filters={filter} />
      <table>
        <thead>
          <tr>
            <th>Color</th>
            <th>
              <button onClick={() => handleFilterChange("red")}>Red</button>
            </th>
            <th>
              <button onClick={() => handleFilterChange("green")}>Green</button>
            </th>
            <th>
              <button onClick={() => handleFilterChange("blue")}>Blue</button>
            </th>
            <th>
              <button onClick={() => handleFilterChange("saturation")}>
                Saturation
              </button>
            </th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {list.map((e, id) => {
            return (
              <tr key={id}>
                <td style={{ backgroundColor: e.hex }}>{e.hex}</td>
                <td>{e.rgb.r}</td>
                <td>{e.rgb.g}</td>
                <td>{e.rgb.b}</td>
                <td>{e.hsl.s} %</td>
                <td>
                  <button onClick={() => handleDelete(e.hex)}>X</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {show ? <PopUpInfo /> : ""}
    </>
  );
}
