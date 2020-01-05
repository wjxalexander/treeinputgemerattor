import React, { useEffect, useReducer } from "react";
import { Input, Icon, Button, Form } from "antd";
import { column } from "./config.js";
import * as R from "ramda";
import style from "./index.module.scss";
import { CustomerInputGroup } from "./addform";
const uuidv4 = require("uuid/v4");

const InputGroup = Input.Group;
const options = [
  { label: "是", value: 1 },
  { label: "否", value: 0 }
];

export const InputForm = props => {
  const { initialData = [] } = props;
  const [state, dispatch] = useReducer(reducer, initialData, init);
  const increment = () => dispatch({ type: "increment" });
  const submit = e => {
    e.preventDefault();
  };
  return (
    <>
      <div className={style.topCon}>
        {state.data.children.map(item => (
          <div key={item.id}>{recursionMethod(item, 0, state, dispatch)}</div>
        ))}
      </div>

      <Button onClick={increment}> add </Button>
      <Button onClick={submit}> submit </Button>
    </>
  );
};

const grouStyle = {
  paddingLeft: "15px",
  marginLeft: "15px",
  borderLeft: "1px dashed rgba(0, 0, 0, 0.4)"
};

const recursionMethod = (item, level, state, dispatch, form) => {
  console.log(level);
  if (item.children.length === 0) {
    return (
      <div
      // className={style.line}
        key={`${item.id}-${level}`}
      >
        <CustomerInputGroup item={item} state={state} dispatch={dispatch} />
      </div>
    );
  }
  return (
    <div key={`${item.id}-${level}`}>
      <CustomerInputGroup item={item} state={state} dispatch={dispatch} />
      <div  style={{ ...grouStyle }}>
        {item.children.map(ele =>
          recursionMethod(ele, level + 1, state, dispatch, form)
        )}
      </div>
    </div>
  );
};

function init(initialData) {
  const topRoot = {
    id: "_root",
    path: "0",
    children: initialData
  };
  return { data: topRoot };
}

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { ...state, data: addFirstLevelChild(state.data) };
    case "remove":
      return { ...state, data: removeFunc(state.data, action) };
    case "appendChild":
      return { ...state, data: appendChildFunc(state.data, action) };
    case "onChange":
      return { ...state, data: onChange(state.data, action) };
    default:
      throw new Error();
  }
}

function addFirstLevelChild(data) {
  const newData = R.clone(data);
  newData.children = newData.children.concat(
    getNewItem(newData.path, newData.children.length)
  );
  return newData;
}

function getNewlistAndpathArr(list, action) {
  const newList = R.clone(list);
  const { path, id, key } = action;
  const pathArr = path.split("-").slice(1);
  return [newList, pathArr, id, key];
}

function trace(list, pathArr, threshold = 0) {
  while (pathArr.length > threshold) {
    list = list.children[pathArr.shift()];
  }
}

function appendChildFunc(list, action) {
  const [newList, pathArr] = getNewlistAndpathArr(list, action);
  let final = newList;
  while (pathArr.length > 0) {
    final = final.children[pathArr.shift()];
  }
  final.children = [
    ...final.children,
    getNewItem(final.path, final.children.length)
  ];
  return newList;
}

export function getValue(list, action) {
  const [newList, pathArr, id, key] = getNewlistAndpathArr(list, action);
  let final = newList;
  while (pathArr.length > 0) {
    if (final && final.children) {
      final = final.children[pathArr.shift()];
    } else {
      break;
    }
  }
  if (R.isEmpty(final) || R.isNil(final)) {
    return "";
  }
  const pointHas = R.has(R.__, final);
  return pointHas(key) ? final[key] : "";
}

function onChange(list, action) {
  const [newList, pathArr, id, key] = getNewlistAndpathArr(list, action);
  const { value } = action;
  let final = newList;
  while (pathArr.length > 0) {
    final = final.children[pathArr.shift()];
  }
  final[key] = value;
  return newList;
}

function removeFunc(list, action) {
  const [newList, pathArr, id] = getNewlistAndpathArr(list, action);
  let finalfatther = newList;
  // console.log(newList,pathArr)
  let fatherindex = 0;
  while (pathArr.length > 1) {
    fatherindex = pathArr.shift();
    finalfatther = finalfatther.children[fatherindex];
  }
  // console.log(finalfatther)
  finalfatther.children = R.compose(
    childrenPathregernerator(finalfatther.path),
    R.reject(ele => ele.id === id)
  )(finalfatther.children);
  return newList;
}

function childrenPathregernerator(fatherPath) {
  return function getfilterList(list = []) {
    if (list.length === 0) {
      return [];
    }
    list.forEach((item, index) => {
      const newPath = `${fatherPath}-${index}`;
      item.path = newPath;
      return childrenPathregernerator(newPath)(item.children);
    });
    return list;
  };
}

const getId = () => {
  return uuidv4();
};

const getNewItem = (fatherPath, index) => {
  return {
    id: getId(),
    path: `${fatherPath}-${index}`,
    children: [],
    nameA: "",
    nameB: "",
    nameC: ""
  };
};
