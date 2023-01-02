import { useState, useEffect } from 'react';
import Logout from '../components/common/Logout';

const TodoListPage = () => {
  const [state, setState] = useState({
    todos: [],
    title: '',
    content: '',
  });

  // const [error, setError] = useState(null);

  const user = localStorage.getItem('user');

  useEffect(() => {
    if (user) {
      fetch('/todos', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: user,
        },
      })
        .then((response) => response.json())
        .then(({ data }) => {
          setState((prev) => ({ ...prev, todos: data }));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [user]);

  const todos = (props) => {
    return props.map((todo) => (
      <div key={todo.id}>
        <ul>
          <li style={{ cursor: 'pointer' }}>{todo.title}</li>
        </ul>
      </div>
    ));
    // return <ul>sdasd</ul>;
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrChange = (e, index) => {
    let tempArr = [...state.updateTodos];
    const { name, value } = e.target;
    tempArr[index][name] = value;
    setState((prev) => ({ ...prev, updateTodos: tempArr }));
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

  const handleClick = (index, key, flag) => {
    let tempArr = [...state.todos];
    // 배열 중 하나만 수정 가능
    if (key === 'update') {
      tempArr.forEach((todo, tempIndex) => {
        if (tempIndex !== index && todo.update) {
          todo.update = false;
        }
      });
    }
    tempArr[index][key] = !flag;
    setState((prev) => ({ ...prev, tempArr }));
  };

  const handleUpdate = (id) => {
    (async () => {
      fetch(`/todos/${id}`, {
        method: 'PUT',
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
          handleSelect();
        })
        .catch((err) => {
          console.log(err);
        });
    })();
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
        <h2>ToDo List</h2>
        <div>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={state.title}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Content
            <input
              type="text"
              name="content"
              value={state.content}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <button onClick={handleAdd}>추가</button>
        </div>
        <div>{state.todos.length ? todos(state.todos) : null}</div>
      </div>
    </div>
  );
};

export default TodoListPage;
