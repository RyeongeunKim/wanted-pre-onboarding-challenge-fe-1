import { useState, useEffect, useCallback } from 'react';
import Logout from '../components/common/Logout';

const TodoListPage = () => {
  const [state, setState] = useState({
    prevTodos: [],
    newTodos: [],
    title: '', // 추가 input 제목
    content: '', // 추가 input 내용
  });

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
        tempArr.forEach((todo) => {
          todo.update = false;
          todo.open = false;
        });
        setState((prev) => ({
          ...prev,
          prevTodos: tempArr,
          newTodos: tempArr,
        }));
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
    return state.newTodos.map((todo, index) => (
      <div key={todo.id}>
        <div
          onClick={() => {
            let tempTodos = [...state.newTodos];
            tempTodos[index] = {
              ...tempTodos[index],
              open: !tempTodos[index].open,
            };
            setState((prev) => ({ ...prev, newTodos: tempTodos }));
          }}
          style={{ display: 'inline-block', cursor: 'pointer' }}
        >
          {todo.open ? '▼' : '▶'}
        </div>
        <input
          type="text"
          name="title"
          value={todo.title}
          readOnly={!todo.update}
          onChange={(e) => handleInputUpdate(index, e.target)}
          style={{
            border: '0px',
            outline: todo.update ? '0.1rem #969696 solid' : 'none',
            display: 'inline-block',
          }}
        />
        {todo.update ? (
          <div
            style={{
              display: 'inline-block',
              marginRight: '5px',
              marginLeft: '5px',
            }}
          >
            <button onClick={() => handleUpdate(index, todo.id)}>수정</button>
            <button onClick={() => handleCancel(index)}>취소</button>
          </div>
        ) : (
          <>
            <div
              onClick={() => {
                let tempTodos = [...state.newTodos];
                tempTodos[index] = {
                  ...tempTodos[index],
                  update: !tempTodos[index].update,
                };
                setState((prev) => ({ ...prev, newTodos: tempTodos }));
              }}
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
          </>
        )}
        <br />
        <div style={{ paddingLeft: '14px' }}>
          {todo.open ? (
            <input
              type="text"
              name="content"
              value={todo.content}
              readOnly={!todo.update}
              onChange={(e) => handleInputUpdate(index, e.target)}
              style={{
                border: '0px',
                outline: todo.update ? '0.1rem #969696 solid' : 'none',
              }}
            />
          ) : null}
        </div>
      </div>
    ));
  };

  const handleCancel = () => {
    setState((prev) => ({ ...prev, newTodos: prev.prevTodos }));
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputUpdate = (index, target) => {
    const { name, value } = target;
    let tempTodos = [...state.newTodos];
    tempTodos[index] = { ...tempTodos[index], [name]: value }; // 복사본 대입하여 객체 참조 해제
    setState((prev) => ({ ...prev, newTodos: tempTodos }));
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
    if (state.newTodos[index].title && state.newTodos[index].content) {
      (async () => {
        fetch(`/todos/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: state.newTodos[index].title,
            content: state.newTodos[index].content,
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
          {state.newTodos.length ? todos() : null}
        </div>
      </div>
    </div>
  );
};

export default TodoListPage;
