import { useState, useEffect, useCallback } from 'react';
import Logout from '../components/common/Logout';

const TodoListPage = () => {
  const [state, setState] = useState({
    todos: [],
    updateTodos: [], // 수정된 배열
    title: '', // 추가 input 제목
    content: '', // 추가 input 내용
  });

  // const [error, setError] = useState(null);

  const user = localStorage.getItem('user');

  const handleSelect = useCallback(() => {
    fetch('/todos', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: user,
      },
    })
      .then((response) => response.json())
      .then(({ data }) => {
        let tempArr = data;
        // tempArr.map((todo) => (todo.open = false));
        tempArr.forEach((todo) => {
          todo.open = false;
          todo.update = false;
          todo.delete = false;
        });
        setState((prev) => ({ ...prev, todos: tempArr }));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [user]);

  useEffect(() => {
    if (user) {
      handleSelect();
    }
  }, [user, handleSelect]);

  const todos = () => {
    return state.todos.map((todo, index) => (
      <div key={todo.id}>
        <div
          onClick={() => {
            let tempTodos = [...state.todos];
            tempTodos[index].open = !todo.open;
            setState((prev) => ({ ...prev, todos: tempTodos }));
          }}
          style={{ display: 'inline-block', cursor: 'pointer' }}
        >
          {todo.open ? '▼' : '▶'}
        </div>
        <input
          type="text"
          name="title"
          value={todo.title}
          onChange={(e) => handleInputUpdate(index, e.target)}
          // readOnly={!todo.update}
          style={{ border: '0px', outline: 'none', display: 'inline-block' }}
        />
        <div
          onClick={() => handleUpdate(index, todo.id)}
          style={{
            display: 'inline-block',
            marginRight: '5px',
            cursor: 'pointer',
          }}
        >
          ✏️
        </div>
        <div
          onClick={() => handleDelete(todo.id)}
          style={{ display: 'inline-block', cursor: 'pointer' }}
        >
          🗑️
        </div>
        <br />
        {todo.open ? (
          <input
            type="text"
            name="content"
            value={todo.content}
            onChange={(e) => handleInputUpdate(index, e.target)}
            // readOnly={!todo.update}
            style={{ border: '0px', outline: 'none', textIndent: '1em' }}
          />
        ) : null}
      </div>
    ));
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputUpdate = (index, target) => {
    console.log(index);
    const { name, value } = target;
    let tempTodos = [...state.todos];
    tempTodos[index][name] = value;
    setState((prev) => ({ ...prev, tempTodos }));
  };

  const handleAdd = () => {
    if (state.title && state.content) {
      (async () => {
        fetch('/todos', {
          method: 'POST',
          body: JSON.stringify({
            title: state.title,
            content: state.content,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: user,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setState((prev) => ({ ...prev, title: '', content: '' }));
            handleSelect();
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    } else {
      alert('제목 또는 내용을 입력해주세요');
    }
  };

  const handleUpdate = (index, id) => {
    if (state.todos[index].title && state.todos[index].content) {
      (async () => {
        fetch(`/todos/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: state.todos[index].title,
            content: state.todos[index].content,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Authorization: user,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            handleSelect();
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    } else {
      alert('제목 또는 내용을 입력해주세요');
    }
  };

  const handleDelete = (id) => {
    (async () => {
      fetch(`/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: user,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          handleSelect();
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  };

  return (
    <div>
      <div>
        <Logout />
      </div>
      <div>
        <h2>할일 추가하기</h2>
        <div>
          제목 : &nbsp;
          <input
            type="text"
            name="title"
            value={state.title}
            onChange={handleChange}
            required
            style={{
              // border: '0px',
              outline: 'none',
              display: 'inline-block',
            }}
          />
        </div>
        <div>
          내용 : &nbsp;
          <input
            type="text"
            name="content"
            value={state.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button onClick={handleAdd}>추가</button>
        </div>
        <hr />
        <div>
          <h2>ToDo List</h2>
          {state.todos.length ? todos() : null}
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;
