import React, { useEffect, useReducer, useCallback, useMemo } from "react";
import { Input, Icon, Button, Form } from "antd";
import { column } from "./config.js";
import { getValue } from "./demo2.jsx";
import * as R from "ramda";
import style from "./index.module.scss";
import cls from "classnames"

const InputGroup = Input.Group;
const options = [
  { label: "是", value: 1 },
  { label: "否", value: 0 }
];
const configWidth = {
  name: "20%",
  default: "30%",
  description: "40%"
};

export const CustomerInputGroup = ({ state, dispatch, item,className }) => {
  const addChild = () => {
    dispatch({ type: "appendChild", id: item.id, path: item.path });
  };
  const removeItem = () => {
    console.log(item,"!!!")
    dispatch({ type: "remove", id: item.id, path: item.path });
  };

  const onChange = (key, e) => {
    dispatch({
      type: "onChange",
      id: item.id,
      path: item.path,
      key: key,
      value: e.target.value
    });
  };

  return (
    <div className={cls(style.inputGroup,className)}>
      <InputGroup compact>
        <span className={style.plus}>
          <Icon onClick={addChild} type="plus-circle" />
        </span>
        {column.map(ele => {
          const value = getValue(state.data, {
            id: item.id,
            path: item.path,
            key: ele.key
          });
          return (
            <Input
              key={`${item.id}-${ele.key}`}
              value={value}
              style={{ width: configWidth[ele.key] }}
              placeholder={ele.placeholder}
              onChange={e => onChange(ele.key, e)}
            />
          );
        })}
        <span  className={style.minus}>
          <Icon onClick={removeItem} type="minus-circle" />
        </span>
      </InputGroup>
    </div>
  );
};


