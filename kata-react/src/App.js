import React, {createContext, useContext, useReducer, useEffect, useRef, useState} from 'react';

const HOST_API = "http://localhost:8080/api";


const initialState = {
  list: [],
  item: {}
};
const Store = createContext(initialState);


//Componente de formulario
const Form = () => {
  const formRef = useRef(null);
  const {dispatch,state : {item}} = useContext(Store);
  const [state, setState] = useState(item);

//evento para añadir
  const onAdd = (event) => {
    event.preventDefault();
//promise
    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-type": "application/json"
      }
    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({ type: "add-item", item: todo});
      setState({ name: ""});
      formRef.current.reset();
    });
  }
//evento para editar 
  const onEdit = (event) => {
    event.preventDefault();
//promise
    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };

    fetch(HOST_API+"/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        "Content-type": "application/json"
      }
    })
    .then(response => response.json())
    .then((todo) => {
      dispatch({ type: "update-item", item: todo});
      setState({ name: ""});
      formRef.current.reset();
    });
  }

  return <form ref={formRef}>
    <input type="text" name='name' defaultValue={item.name} onChange={(event) => {
      setState({ ...state, name:event.target.value })
    }}/>{item.id && <button onClick={onEdit}>Actualizar</button>}
    {!item.id && <button onClick={onAdd}>Agregar</button>}
  
    
  </form>
}


//Componente todo
const Todo = () => {

  const {dispatch, state} = useContext(Store);
//promise para actualizar la lista sin hacer refresh
  useEffect(() => {
    fetch(HOST_API+"/todos")
    .then(response => response.json())
    .then((list) => {
      dispatch({type: "update-list", list})
    })
  }, [state.list.length, dispatch])

//evento para eliminar
  const onDelete = (id) =>{
    fetch(HOST_API + "/"+id+"/todo",{
      method: "DELETE"
    })
    .then((list) => {
      dispatch({ type: "delete-item",id})
    })
  };

//Evento para editar un item del todo
  const onEdit = (todo)  => {
    dispatch({ type: "edit-item",item: todo})


  };
  return <div>  
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Nombre</td>
          <td>Esta completado?</td>
        </tr>
      </thead>
      <tbody>
        {
          state.list.map((todo) => {
            return <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.name}</td>
              <td>{todo.isCompleted === true ? "SI": "NO"}</td>
              <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
              <td><button onClick={() => onEdit(todo)}>Editar</button></td>
            </tr>
          })
        }
      </tbody>
    </table>
  </div>
}

//funcion que esta a la escucha para ejecutar los eventos
function reducer(state, action) {
  switch (action.type) {
    case 'update-item':
      const listUpdateEdit= state.list.map((item)=>{
        if(item.id===action.item.id) {
          return action.item;
        }
        return item;
      });
      return {...state, list:listUpdateEdit, item:{}}

    case 'delete-item':
      const listUpdate= state.list.filter((item) => {
        return item.id!==action.id;
      });
      return {...state, list: listUpdate}
    case 'update-list':
      return { ...state, list: action.list }
    case 'edit-item':
      return { ...state, item: action.item }
    case 'add-item':
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list:newList}
    default:
      return state;
  }
}


//contenedor que usa el reducer
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={ {state, dispatch} }>
    {children}
  </Store.Provider>
}
//ejecutable
function App() {
  return (
    <StoreProvider>
      <Form />
      <Todo />
    </StoreProvider>
  );
}

export default App;