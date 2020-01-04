import React, { useEffect, useReducer } from "react";
import { Input, Icon, Button } from "antd";
import * as R from "ramda";
const uuidv4 = require("uuid/v4");

const InputGroup = Input.Group;

export const CustomerInputGroup = props => {
  const { state, dispatch, id } = props;

  const addChild = () => {
    console.log(id);
    console.log(state);
    dispatch({ type: "appendChild", id: id });
  };
  return (
    <div style={{display:'flex'}}>
      <Icon onClick={addChild} type="plus-circle" />
      <InputGroup compact>
        <Input defaultValue="0571" />
        {/* <Input defaultValue="26888888" /> */}
      </InputGroup>
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
        <CustomerInputGroup id={item.id} state={state} dispatch={dispatch} />
      </>
    );
  }
  // console.log(item);
  return (
    <>
      <span>{level}</span>
      <CustomerInputGroup id={item.id} state={state} dispatch={dispatch} />
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
      return { ...state, data: [...state.data, getNewItem()] };
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
  const { id } = action;
  // console.log(list, id);
  const item = findIndex(id, newList);
  // console.log(item.id);
  console.log(item)
  if (item) {
    item.children = [...item.children, getNewItem()];
  }
  // console.log(newList);
  return newList;
}

const getId = () => {
  return uuidv4();
};

const getNewItem = () => {
  return {
    id: getId(),
    columnName: "",
    chineseName: "",
    children: []
  };
};
const findIndex = (id, list) => {
  if (list.length === 0) {
    return;
  }
  let res = undefined;
  res = R.find(R.propEq("id", id))(list);
  if (!R.isNil(res)) {
    return res;
  }
   for(let i= 0;i<list.length;i++){
      if(!res){
        res = findIndex(id,list[i].children)
      }
   }  
   
   return res;
};
