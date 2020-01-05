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
  const { initialData = [], form } = props;
  const [state, dispatch] = useReducer(reducer, initialData, init);
  const increment = () => dispatch({ type: "increment" });
  const submit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  return (
    <>
      {state.data.children.map(item => (
        <div key={item.id}>
          {recursionMethod(item, 0, state, dispatch, form)}
        </div>
      ))}
      <Button onClick={increment}> add </Button>
      <Button onClick={submit}> submit </Button>
    </>
  );
};

export const FormTable = Form.create({ name: "register" })(InputForm);

const recursionMethod = (item, level, state, dispatch, form) => {
  if (item.children.length === 0) {
    return (
      <div key={item.id} style={{ paddingLeft: "30px" }}>
        <CustomerInputGroup
          form={form}
          item={item}
          state={state}
          dispatch={dispatch}
        />
      </div>
    );
  }
  return (
    <div key={item.id} style={{ paddingLeft: "30px" }}>
      <CustomerInputGroup
        form={form}
        item={item}
        state={state}
        dispatch={dispatch}
      />
      {item.children.map(ele =>
        recursionMethod(ele, level + 1, state, dispatch, form)
      )}
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

function trace(list, pathArr, threshold = 0){
  while(pathArr.length > threshold){
    list = list.children[pathArr.shift()]
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
    final = final.children[pathArr.shift()];
  }
  return final[key];
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
  let fatherindex = 0;
  while (pathArr.length > 1) {
    fatherindex = pathArr.shift();
    finalfatther = finalfatther.children[fatherindex];
  }

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
    const newlist = R.clone(list);
    newlist.forEach((item, index) => {
      item.path = `${fatherPath}-${index}`;
      childrenPathregernerator(item.children, item.path);
    });
    return newlist;
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
    nameA: "1",
    nameB: "2",
    nameC: "3"
  };
};
