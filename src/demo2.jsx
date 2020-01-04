import React, { useEffect, useReducer } from "react";
import { Input, Icon, Button } from "antd";
import * as R from "ramda";
const uuidv4 = require("uuid/v4");

const InputGroup = Input.Group;

export const CustomerInputGroup = props => {
  const { state, dispatch, item } = props;

  const addChild = () => {
    console.log(item,props,'click');
    console.log(state);
    console.log("__________")
    dispatch({ type: "appendChild", id: item.id, path:item.path });
  };
  return (
    <div style={{display:'flex',width:"200px"}}>
      <Icon onClick={addChild} type="plus-circle" />
      <InputGroup compact>
        <Input defaultValue="0571" />
        {/* <Input defaultValue="26888888" /> */}
      </InputGroup>
      <Icon type="minus-circle" />
    </div>
  );
};

export const InputForm = props => {
  const { initialData = [] } = props;
  const [state, dispatch] = useReducer(reducer, initialData, init);
  const increment = () => dispatch({ type: "increment" });

  return (
    <>
      {state.data.map(item => (
        <div key={item.id}>{recursionMethod(item, 0, state, dispatch)}</div>
      ))}
      <Button onClick={increment}> add </Button>
    </>
  );
};

const recursionMethod = (item, level, state, dispatch) => {
  // console.log(item, level);
  if (item.children.length === 0) {
    return (
      <>
        <span>{level}</span>
        <CustomerInputGroup item={item} state={state} dispatch={dispatch} />
      </>
    );
  }
  // console.log(item);
  return (
    <>
      <span>{level}</span>
      <CustomerInputGroup item={item} state={state} dispatch={dispatch} />
      {item.children.map(ele =>
        recursionMethod(ele, level + 1, state, dispatch)
      )}
    </>
  );
};

function init(initialData) {
  return { data: initialData };
}

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      // console.log(getNewItem());
      return { ...state, data: [...state.data, getNewItem(0,state.data.length)] };
    case "decrement":
      return { count: state.count - 1 };
    case "appendChild":
      return { ...state, data: appendChildFunc(state.data, action) };
    default:
      throw new Error();
  }
}

function appendChildFunc(list, action) {
  // console.log(newList);

  const newList = R.clone(list);
  const { id,path } = action;
  console.log(list, id,path,"path!!!!");
  const pathArr = path.split("-").slice(1)
  let final = newList
  const pos = pathArr.shift()
  final = final[pos]
  while(pathArr.length > 0){
    final = final.children[pathArr.shift()]
  }
  final.children = [...final.children, getNewItem(path,final.children.length)];
  console.log(newList,final);
  return newList;
}

const getId = () => {
  return uuidv4();
};

const getNewItem = (fatherPath, index) => {
  return {
    id: getId(),
    columnName: "",
    chineseName: "",
    path:`${fatherPath}-${index}`,
    children: []
  };
};

